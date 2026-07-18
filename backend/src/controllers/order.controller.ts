import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const checkout = async (req: Request, res: Response) => {
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
};

export const getOrdersByRole = async (req: Request, res: Response) => {
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
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: id as string },
      data: { status }
    });
    res.json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
};
