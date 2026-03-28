import { Router } from 'express';
import {
    getAllUsers,
    deleteUserById,
    getAllNotesAdmin,
    getStats,
    getNoteCountByUser,
    banUser,
    unbanUser,
} from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = Router();

// Alle Admin-Routen mit protect + adminOnly absichern
router.use(protect, adminOnly);

// Systemweite Statistiken (Benutzer- und Notizanzahl)
router.get('/stats', getStats);

// Alle Benutzer auflisten (US-13)
router.get('/users', getAllUsers);

// Anzahl der Notizen eines bestimmten Benutzers
router.get('/users/:id/notes-count', getNoteCountByUser);

// Benutzer + Notizen löschen (US-14)
router.delete('/users/:id', deleteUserById);

// Benutzer sperren (US-14)
router.patch('/users/:id/ban', banUser);

// Benutzer entsperren (US-14)
router.patch('/users/:id/unban', unbanUser);

// Alle Notizen systemweit (US-15)
router.get('/notes', getAllNotesAdmin);

export default router;
