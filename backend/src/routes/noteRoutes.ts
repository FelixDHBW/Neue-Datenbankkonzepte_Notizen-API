import { Router } from 'express';
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from '../controllers/noteController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

/** Alle Routen durch protect absichern – JWT erforderlich (FA-07, FA-08) */
router.use(protect);

/** POST / → Neue Notiz erstellen, Benutzer aus JWT zugeordnet (US-03) */
router.post('/', createNote);

/** GET / → Alle eigenen Notizen abrufen (US-05, FA-08) */
router.get('/', getNotes);

/** GET /:id → Einzelne Notiz per ID abrufen, Ownership geprüft (US-04, FA-08) */
router.get('/:id', getNoteById);

/** PUT /:id → Notiz aktualisieren, alle Felder optional (US-06, US-11, FA-08) */
router.put('/:id', updateNote);

/** DELETE /:id → Notiz endgültig löschen (US-07, FA-08) */
router.delete('/:id', deleteNote);

export default router;
