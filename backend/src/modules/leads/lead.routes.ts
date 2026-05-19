import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import * as leadController from './lead.controller';
import {
  createLeadSchema,
  leadIdSchema,
  leadQuerySchema,
  updateLeadSchema,
} from './lead.schemas';

const router = Router();

router.use(authenticate);

router.get('/export', validate(leadQuerySchema, 'query'), leadController.exportCsv);
router.get('/', validate(leadQuerySchema, 'query'), leadController.list);
router.get('/:id', validate(leadIdSchema, 'params'), leadController.getById);
router.post('/', validate(createLeadSchema), leadController.create);
router.patch('/:id', validate(leadIdSchema, 'params'), validate(updateLeadSchema), leadController.update);
router.delete(
  '/:id',
  validate(leadIdSchema, 'params'),
  authorize('admin'),
  leadController.remove,
);

export default router;
