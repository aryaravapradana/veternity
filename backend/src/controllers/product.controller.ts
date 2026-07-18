import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { seller: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

export const getSellerProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { sellerId: req.params.id as string },
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch seller products' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { sellerId, title, description, category, price, stock, minOrder, unit, imageUrls } = req.body;
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
        imageUrls: imageUrls || []
      }
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, category, price, stock, minOrder, unit, imageUrls } = req.body;
    
    const existing = await prisma.product.findUnique({ where: { id: id as string } });
    if (!existing) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: id as string },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        category: category !== undefined ? category : existing.category,
        price: price !== undefined ? price : existing.price,
        stock: stock !== undefined ? stock : existing.stock,
        minOrder: minOrder !== undefined ? minOrder : existing.minOrder,
        unit: unit !== undefined ? unit : existing.unit,
        imageUrls: imageUrls !== undefined ? imageUrls : existing.imageUrls,
      }
    });
    res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: id as string } });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
