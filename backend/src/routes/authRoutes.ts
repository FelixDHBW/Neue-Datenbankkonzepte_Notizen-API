import { Router } from 'express';
import { register } from '../controllers/authController';

const router = Router();

/** POST /api/auth/register → Benutzer registrieren (US-01) */
router.post('/register', register);

export default router;
