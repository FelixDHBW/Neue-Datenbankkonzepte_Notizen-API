import { Router } from 'express';
import { register, login } from '../controllers/authController';

const router = Router();

// Benutzer registrieren (US-01)
router.post('/register', register);

// Benutzer anmelden, JWT ausstellen (US-02, FA-07)
router.post('/login', login);

export default router;
