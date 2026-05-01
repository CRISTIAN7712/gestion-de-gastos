import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import transactionsRoutes from './routes/transactions.routes.js';
import reportsRoutes from './routes/reports.routes.js';
import usersRoutes from './routes/users.routes.js';
import { env } from './config/env.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.listen(env.port, () => {
  console.log(`API escuchando en puerto ${env.port}`);
});
