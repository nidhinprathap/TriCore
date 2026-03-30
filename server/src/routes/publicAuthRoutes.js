import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, googleLogin, getMe } from '../controllers/publicAuthController.js';
import validate from '../middleware/validate.js';
import publicAuth from '../middleware/publicAuth.js';
import { z } from 'zod';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { error: { message: 'Too many login attempts. Please try again in 15 minutes.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const googleSchema = z.object({
  credential: z.string().min(1),
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/google', authLimiter, validate(googleSchema), googleLogin);
router.get('/me', publicAuth, getMe);

export default router;
