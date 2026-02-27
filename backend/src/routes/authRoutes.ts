import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

/** POST /api/auth/register → Benutzer registrieren (US-01) */
router.post('/register', register);

/** POST /api/auth/login → Benutzer anmelden, JWT ausstellen (US-02, FA-07) */
router.post('/login', login);

export default router;
