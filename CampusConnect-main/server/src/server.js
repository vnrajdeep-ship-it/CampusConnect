import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import itemRoutes from './routes/items.js';
import adminRoutes from './routes/admin.js';

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
app.get('/api/health', (_req, res) => res.json({ status: 'ok', message: 'CampusConnect API is running.' }));
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/admin', adminRoutes);
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ message: 'Unexpected server error.' }); });

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`Server running on http://localhost:${port}`))).catch(err => { console.error('Database connection failed:', err.message); process.exit(1); });
