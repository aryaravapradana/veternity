import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const register = async (req: Request, res: Response) => {
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
};

export const login = async (req: Request, res: Response) => {
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
};
