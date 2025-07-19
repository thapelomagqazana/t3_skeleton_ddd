import express from 'express';
import { validate } from '../../middleware/validate';
import { SignUpSchema, SignInSchema } from '../../schemas/user.schema';
import { signup, signin, signout } from '../../controllers/v1/auth.controller';
import { authenticateJWT } from '../../middleware/auth.middleware';

const router = express.Router();

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignUpInput'
 *     responses:
 *       201:
 *         description: User signed up successfully
 *       400:
 *         description: Validation error
 */
router.post('/signup', validate(SignUpSchema), signup);

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Sign in an existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignInInput'
 *     responses:
 *       200:
 *         description: Signed in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/signin', validate(SignInSchema), signin);

/**
 * @swagger
 * /signout:
 *   post:
 *     summary: Sign out the current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Signed out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/signout', authenticateJWT, signout);

export default router;
