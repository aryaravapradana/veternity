import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const getDashboardOverview = async (req: Request, res: Response) => {
  try {
    const cornPrice = await prisma.commodityPrice.findFirst({
      where: { commodity: 'JAGUNG_PETERNAK' },
      orderBy: { recordedAt: 'desc' }
    });

    res.json({
      cornPrice: cornPrice?.pricePerKg || 0,
      healthIndex: 98.8 // Mock for now
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getPrices = async (req: Request, res: Response) => {
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
};
