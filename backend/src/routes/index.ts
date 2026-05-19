import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import healthRoutes from '../modules/health/health.routes';
import leadRoutes from '../modules/leads/lead.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

export default router;
