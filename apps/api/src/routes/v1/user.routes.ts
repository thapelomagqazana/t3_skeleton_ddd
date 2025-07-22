import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../../controllers/v1/user.controller';
import { authGuard } from '@interfaces/http/middleware/auth.middleware';

const router = Router();
router.get('/', authGuard, getUsers);
router.get('/:id', authGuard, getUserById);
router.put('/:id', authGuard, updateUser);
router.delete('/:id', authGuard, deleteUser);
export default router;
