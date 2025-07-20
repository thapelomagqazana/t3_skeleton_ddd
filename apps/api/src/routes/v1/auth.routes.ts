import { Router } from 'express';
import { signin, signup, signout } from '../../controllers/v1/auth.controller';

const router = Router();
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
export default router;
