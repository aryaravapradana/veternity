import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { startBapanasCronJob } from './cron/bapanasFetcher';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Start background cron jobs
startBapanasCronJob();

// Basic health check
app.get('/api/status', (req: Request, res: Response) => {
  res.json({ status: 'OK', service: 'Pranata API', version: '1.0.0' });
});

// Get overview stats for Dashboard
app.get('/api/dashboard/overview', async (req: Request, res: Response) => {
  try {
    // 1. Get total active flock count and sum of target weight
    const activeFlocks = await prisma.flock.findMany({ where: { status: 'ACTIVE' } });
    const totalBirds = activeFlocks.length * 1000; // Mock 1000 birds per flock entry for MVP
    
    // 2. Get pending tasks for today
    const pendingTasks = await prisma.task.count({ 
      where: { 
        isCompleted: false, 
        dueDate: { lte: new Date() } 
      } 
    });

    // 3. Get latest commodity prices
    const cornPrice = await prisma.commodityPrice.findFirst({
      where: { commodity: 'CORN' },
      orderBy: { recordedAt: 'desc' }
    });

    res.json({
      totalBirds,
      activeFlocksCount: activeFlocks.length,
      pendingTasks,
      cornPrice: cornPrice?.pricePerKg || 0,
      healthIndex: 98.8 // Mock for now
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get all commodity prices (Mock Benchmark)
app.get('/api/prices', async (req: Request, res: Response) => {
  try {
    const prices = await prisma.commodityPrice.findMany({
      orderBy: { recordedAt: 'desc' },
      take: 50
    });
    
    const latestUnique = Array.from(
      new Map(prices.map(item => [item.commodity, item])).values()
    );

    res.json(latestUnique);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Check Username Availability
app.get('/api/profile/check-username', async (req: Request, res: Response) => {
  const { username } = req.query;
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  try {
    const existing = await prisma.profile.findUnique({ where: { username: username.toLowerCase() } });
    if (existing) {
      return res.json({ available: false });
    }
    res.json({ available: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to check username' });
  }
});

// Fetch a Profile
app.get('/api/profile/:id', async (req: Request, res: Response) => {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: req.params.id as string }
    });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update a Profile (CRUD: username, fullName, farmName, location, contact, avatarUrl, password)
app.patch('/api/profile/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, fullName, farmName, location, contact, avatarUrl, bannerUrl, currentPassword, newPassword } = req.body;

  try {
    // If changing username, check it's not taken by someone else
    if (username) {
      const existing = await prisma.profile.findFirst({
        where: { username: username.toLowerCase(), NOT: { id } }
      });
      if (existing) {
        return res.status(409).json({ error: 'Username sudah dipakai oleh akun lain.' });
      }
    }

    // If changing password, verify current password first
    if (newPassword) {
      const profile = await prisma.profile.findUnique({ where: { id } });
      if (!profile || profile.password !== currentPassword) {
        return res.status(401).json({ error: 'Password saat ini tidak sesuai.' });
      }
    }

    const updateData: Record<string, any> = {};
    if (username !== undefined)  updateData.username  = username.toLowerCase();
    if (fullName !== undefined)  updateData.fullName  = fullName;
    if (farmName !== undefined)  updateData.farmName  = farmName;
    if (location !== undefined)  updateData.location  = location;
    if (contact  !== undefined)  updateData.contact   = contact;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (bannerUrl !== undefined) updateData.bannerUrl = bannerUrl;
    if (newPassword)             updateData.password  = newPassword;

    const updated = await prisma.profile.update({ where: { id }, data: updateData });

    // Return profile without password
    const { password: _, ...safeProfile } = updated;
    res.json(safeProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Register a New User
app.post('/api/profile/register', async (req: Request, res: Response) => {
  const { username, password, fullName, role, livestockTypes } = req.body;
  
  try {
    const existing = await prisma.profile.findUnique({ where: { username } });
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const profile = await prisma.profile.create({
      data: {
        username,
        password, // Plain text for MVP
        fullName,
        role: role || 'BUYER',
        livestockTypes: livestockTypes || []
      }
    });
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});


// Login an Existing User
app.post('/api/profile/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  
  try {
    const profile = await prisma.profile.findUnique({ where: { username } });
    
    if (!profile || profile.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Marketplace: Get all products (Catalog)
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { seller: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Marketplace: Get seller's products
app.get('/api/products/seller/:id', async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: req.params.id as string },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seller products' });
  }
});

// Marketplace: Add a new product
app.post('/api/products', async (req: Request, res: Response) => {
  try {
    const { sellerId, title, description, category, price, stock, minOrder, unit, imageUrl } = req.body;
    const product = await prisma.product.create({
      data: { 
        sellerId, 
        title, 
        description, 
        category: category || "Lainnya",
        price, 
        stock, 
        minOrder: minOrder || 1,
        unit, 
        imageUrl 
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Marketplace Checkout (Mock Payment)
app.post('/api/checkout', async (req: Request, res: Response) => {
  try {
    const { buyerId, sellerId, items, shippingAddress, shippingMethod, paymentMethod, shippingFee, platformFee } = req.body;
    
    // Calculate total
    const itemsSubtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const totalAmount = itemsSubtotal + (shippingFee || 0) + (platformFee || 0);

    const order = await prisma.order.create({
      data: {
        buyerId,
        sellerId,
        totalAmount,
        shippingAddress,
        shippingMethod,
        paymentMethod,
        shippingFee: shippingFee || 0,
        platformFee: platformFee || 0,
        status: 'PAID', // Mock payment gateway auto-success
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtTime: item.price
          }))
        }
      },
      include: { items: true }
    });

    // Deduct stock (simplified)
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } }
      });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

// Get Orders for Seller or Buyer
app.get('/api/orders/:role/:id', async (req: Request, res: Response) => {
  try {
    const { role, id } = req.params;
    const orders = await prisma.order.findMany({
      where: role === 'PRODUCER' ? { sellerId: id as string } : { buyerId: id as string },
      include: { 
        items: { include: { product: true } },
        buyer: true,
        seller: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Pranata Backend Server running at http://localhost:${port}`);
});
