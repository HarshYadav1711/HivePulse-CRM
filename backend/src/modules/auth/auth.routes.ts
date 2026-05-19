import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as authController from './auth.controller';
import { loginBodySchema, registerBodySchema } from './auth.schemas';

const router = Router();

router.post('/register', validate(registerBodySchema), authController.register);
router.post('/login', validate(loginBodySchema), authController.login);
router.get('/me', authenticate, authController.me);

export default router;
