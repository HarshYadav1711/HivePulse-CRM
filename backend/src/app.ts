import cors from 'cors';
import express from 'express';
import { env } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import leadRoutes from './modules/leads/lead.routes';

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', service: 'hivepulse-api' } });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/leads', leadRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
