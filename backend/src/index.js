import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

import { initDb } from './db/schema.js';
import { seedDb } from './db/seed.js';
import { auth } from './middleware/auth.js';

import itemsRouter from './routes/items.js';
import recommendationsRouter from './routes/recommendations.js';
import plansRouter from './routes/plans.js';
import autoAddRouter from './routes/autoAdd.js';
import activityRouter from './routes/activity.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

mkdirSync(path.join(__dirname, '../data'), { recursive: true });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:4173',
    /\.railway\.app$/,
    /\.render\.com$/,
  ],
  credentials: true,
}));
app.use(express.json());
app.use(auth);

app.use('/items', itemsRouter);
app.use('/recommendations', recommendationsRouter);
app.use('/plans', plansRouter);
app.use('/auto-add', autoAddRouter);
app.use('/activity', activityRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

initDb();
seedDb();

app.listen(PORT, () => {
  console.log(`✓ CLT Bucket List API running at http://localhost:${PORT}`);
});
