import { Router } from 'express';
import authRoutes from './auth.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import productRoutes from './product.routes';
import profileRoutes from './profile.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

router.use('/profile', authRoutes); // /api/profile/register, /api/profile/login
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/products', productRoutes);
router.use('/profile', profileRoutes); // /api/profile/:id, /api/profile/check-username (Wait, we should split these carefully, but they share the same base path so it's fine)
router.use('/dashboard', dashboardRoutes); // /api/dashboard/overview, /api/prices (Wait, prices is at /api/prices originally, let's fix that in app.ts or route it here)

export default router;
