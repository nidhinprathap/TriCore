import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { login, getMe } from '../controllers/authController.js';
import { loginSchema } from '../validators/authSchemas.js';
import validate from '../middleware/validate.js';
import auth from '../middleware/auth.js';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { error: { message: 'Too many login attempts. Please try again in 15 minutes.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/login', authLimiter, validate(loginSchema), login);
router.get('/me', auth, getMe);

export default router;
