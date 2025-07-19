import { Router } from 'express';
import { resetUsers } from '../controllers/test.controller';

const router = Router();

router.post('/reset-user', resetUsers);

export default router;
