import { Request, Response } from 'express';
import { noteService } from '../services/index.js';

// Erstellt eine neue Notiz für den angemeldeten Benutzer (US-03)
export const createNote = async (req: Request, res: Response): Promise<void> => {
    const { title, content, tags, priority, reminderDate, customFields, checklist } = req.body;

    // Pflichtfelder validieren (NFA-02, NFA-03)
    if (!title || !content) {
        res.status(400).json({ success: false, message: 'Titel und Inhalt sind Pflichtfelder.' });
        return;
    }

    // Notiz mit Benutzer-ID verknüpfen – Datenisolation sichergestellt (FA-08, US-03)
    const note = await noteService.createNote(req.user!._id, {
        title,
        content,
        tags,
        priority,
        reminderDate,
        customFields,
        checklist,
    });

    res.status(201).json({ success: true, data: note });
};

// Gibt alle Notizen des Benutzers mit Filter, Suche und Sortierung zurück (FA-01–FA-04, FA-08)
export const getNotes = async (req: Request, res: Response): Promise<void> => {
    const { tag, priority, search, sort } = req.query;

    const notes = await noteService.getNotes(req.user!._id, {
        tag: typeof tag === 'string' ? tag : undefined,
        priority: typeof priority === 'string' ? priority : undefined,
        search: typeof search === 'string' ? search : undefined,
        sort: sort === 'asc' ? 'asc' : 'desc',
    });

    res.status(200).json({ success: true, count: notes.length, data: notes });
};

// Gibt eine einzelne Notiz zurück – nur wenn sie dem Benutzer gehört (US-04, FA-08)
export const getNoteById = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params['id'] ?? '');

    if (!id || !noteService.isValidNoteId(id)) {
        res.status(400).json({ success: false, message: 'Ungültige Notiz-ID.' });
        return;
    }

    const note = await noteService.getNoteById(id, req.user!._id);

    // Notiz nicht gefunden oder gehört einem anderen Benutzer (US-04, FA-08)
    if (!note) {
        res.status(404).json({ success: false, message: 'Notiz nicht gefunden.' });
        return;
    }

    res.status(200).json({ success: true, data: note });
};

// Aktualisiert eine Notiz, nur wenn sie dem Benutzer gehört (US-06, US-11, FA-08)
export const updateNote = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params['id'] ?? '');

    if (!id || !noteService.isValidNoteId(id)) {
        res.status(400).json({ success: false, message: 'Ungültige Notiz-ID.' });
        return;
    }

    const { title, content, tags, priority, reminderDate, customFields, checklist } = req.body;

    try {
        const updated = await noteService.updateNote(id, req.user!._id, {
            title,
            content,
            tags,
            priority,
            reminderDate,
            customFields,
            checklist,
        });

        // Notiz nicht gefunden oder gehört anderem Benutzer (FA-08)
        if (!updated) {
            res.status(404).json({ success: false, message: 'Notiz nicht gefunden.' });
            return;
        }

        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        // Mongoose-Validierungsfehler abfangen (NFA-02)
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Validierungsfehler.',
        });
    }
};

// Löscht eine Notiz endgültig, nur wenn sie dem Benutzer gehört (US-07, FA-08)
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params['id'] ?? '');

    if (!id || !noteService.isValidNoteId(id)) {
        res.status(400).json({ success: false, message: 'Ungültige Notiz-ID.' });
        return;
    }

    const deleted = await noteService.deleteNote(id, req.user!._id);

    // Notiz nicht gefunden oder gehört anderem Benutzer (FA-08, US-07)
    if (!deleted) {
        res.status(404).json({ success: false, message: 'Notiz nicht gefunden.' });
        return;
    }

    res.status(200).json({ success: true, message: 'Notiz erfolgreich gelöscht.' });
};
