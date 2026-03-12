import { Router } from 'express';
import { getAllUsers, manageUserStatus, getAllNotesAdmin } from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/roleMiddleware';

const router = Router();

// Alle Admin-Routen mit protect + adminOnly absichern
router.use(protect, adminOnly);

// Alle Benutzer auflisten
router.get('/users', getAllUsers);

// Benutzer + Notizen löschen (US-14)
router.delete('/users/:id', manageUserStatus);

// Alle Notizen systemweit (US-15)
router.get('/notes', getAllNotesAdmin);

export default router;
