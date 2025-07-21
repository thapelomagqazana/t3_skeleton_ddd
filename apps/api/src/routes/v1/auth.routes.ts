import { Router } from 'express';
import { signin, signup, signout } from '../../controllers/v1/auth.controller';
import { authGuard } from '@interfaces/http/middleware/auth.middleware';

const router = Router();
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', authGuard, signout);
export default router;
