import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import { getPrices } from './controllers/dashboard.controller'; // Kept at root for backward compatibility

const app = express();

app.use(cors());
app.use(express.json({ limit: '5mb' }));

app.get('/api/status', (req: Request, res: Response) => {
  res.json({ status: 'OK', service: 'Pranata API', version: '1.0.0' });
});

// For backward compatibility since we had /api/prices and /api/events outside
app.get('/api/prices', getPrices);

import { getSellerEvents, createEvent, updateEvent, deleteEvent } from './controllers/profile.controller';
app.get('/api/events/:sellerId', getSellerEvents);
app.post('/api/events', createEvent);
app.put('/api/events/:id', updateEvent);
app.delete('/api/events/:id', deleteEvent);

app.use('/api', routes);

export default app;
