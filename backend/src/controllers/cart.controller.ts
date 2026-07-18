import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getCart = async (req: Request, res: Response) => {
  try {
    const buyerId = req.params.buyerId as string;
    const cart = await prisma.cartItem.findMany({
      where: { buyerId },
      include: { product: true }
    });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const buyerId = req.params.buyerId as string;
    const { productId, quantity } = req.body;
    
    const cartItem = await prisma.cartItem.upsert({
      where: {
        buyerId_productId: { buyerId, productId: String(productId) }
      },
      update: { quantity: Number(quantity) },
      create: { buyerId, productId: String(productId), quantity: Number(quantity) }
    });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  try {
    const buyerId = req.params.buyerId as string;
    const productId = req.params.productId as string;
    await prisma.cartItem.delete({
      where: {
        buyerId_productId: { buyerId, productId }
      }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const buyerId = req.params.buyerId as string;
    await prisma.cartItem.deleteMany({
      where: { buyerId }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};
