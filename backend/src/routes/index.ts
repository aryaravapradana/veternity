import { Router } from 'express';
import authRoutes from './auth.routes';
import { verifyToken } from '../middlewares/auth.middleware';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import productRoutes from './product.routes';
import profileRoutes from './profile.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/profile', authRoutes); // /api/profile/register, /api/profile/login
router.use('/cart', verifyToken, cartRoutes);
router.use('/orders', verifyToken, orderRoutes);
router.use('/products', verifyToken, productRoutes);
router.use('/profile', verifyToken, profileRoutes); // /api/profile/:id, /api/profile/check-username
router.use('/dashboard', verifyToken, dashboardRoutes); // /api/dashboard/overview, /api/prices

export default router;
