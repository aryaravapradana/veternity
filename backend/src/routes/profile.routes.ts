import { Router } from 'express';
import { checkUsername, getProfile, updateProfile, getSellerEvents, createEvent, updateEvent, deleteEvent } from '../controllers/profile.controller';

const router = Router();

router.get('/check-username', checkUsername);
router.get('/:id', getProfile);
router.patch('/:id', updateProfile);

// Events
router.get('/events/:sellerId', getSellerEvents);
router.post('/events', createEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

export default router;
