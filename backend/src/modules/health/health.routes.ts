import { Router } from 'express';
import { APP_NAME } from '@hivepulse/shared';
import { sendSuccess } from '../../utils/apiResponse';

const router = Router();

router.get('/', (_req, res) => {
  sendSuccess(res, { status: 'ok', service: APP_NAME });
});

export default router;
