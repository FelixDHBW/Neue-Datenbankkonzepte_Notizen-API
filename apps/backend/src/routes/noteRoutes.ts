import { Router } from 'express';
import { createNote, getNotes, getNoteById, updateNote, deleteNote } from '../controllers/noteController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Alle Routen durch protect absichern (FA-07, FA-08)
router.use(protect);

// Neue Notiz erstellen (US-03)
router.post('/', createNote);

// Alle eigenen Notizen abrufen (US-05, FA-08)
router.get('/', getNotes);

// Einzelne Notiz per ID abrufen (US-04, FA-08)
router.get('/:id', getNoteById);

// Notiz aktualisieren, alle Felder optional (US-06, US-11, FA-08)
router.put('/:id', updateNote);

//  Notiz endgültig löschen (US-07, FA-08)
router.delete('/:id', deleteNote);

export default router;
