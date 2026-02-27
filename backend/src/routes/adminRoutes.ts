import { Router } from 'express';
import { getAllUsers, manageUserStatus, getAllNotesAdmin } from '../controllers/adminController';
import { protect } from '../middleware/authMiddleware';
import { adminOnly } from '../middleware/roleMiddleware';

const router = Router();

/** Alle Admin-Routen mit protect + adminOnly absichern (Rollenmodell: nur 'Administrator') */
router.use(protect, adminOnly);

/** GET /api/admin/users → Alle Benutzer auflisten (US-13) */
router.get('/users', getAllUsers);

/** DELETE /api/admin/users/:id → Benutzer + Notizen löschen (US-14) */
router.delete('/users/:id', manageUserStatus);

/** GET /api/admin/notes → Alle Notizen systemweit (US-15) */
router.get('/notes', getAllNotesAdmin);

export default router;
