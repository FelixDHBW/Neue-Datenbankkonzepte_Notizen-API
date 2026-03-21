import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Note from '../models/Note';

// Erstellt eine neue Notiz für den angemeldeten Benutzer (US-03)

export const createNote = async (req: Request, res: Response): Promise<void> => {
    const { title, content, tags, priority, reminderDate, customFields, checklist } = req.body;

    // Pflichtfelder validieren (NFA-02, NFA-03)
    if (!title || !content) {
        res.status(400).json({ success: false, message: 'Titel und Inhalt sind Pflichtfelder.' });
        return;
    }

    // Notiz mit Benutzer-ID verknüpfen – Datenisolation sichergestellt (FA-08, US-03)
    const note = await Note.create({
        user: req.user!._id,
        title,
        content,
        tags: tags ?? [],
        priority: priority ?? null,
        reminderDate: reminderDate ?? null,
        customFields: customFields ?? {},
        checklist: checklist ?? [],
    });

    res.status(201).json({ success: true, data: note });
};

// Gibt alle Notizen des Benutzers mit Filter zurück, Suche und Sortierung (FA-01–FA-04, FA-08)

export const getNotes = async (req: Request, res: Response): Promise<void> => {
    const { tag, priority, search, sort } = req.query;

    // Basis-Filter: nur Notizen des aktuellen Benutzers (FA-08)
    const query: Record<string, unknown> = { user: req.user!._id };

    // Tag-Filter: enthält den gesuchten Tag (FA-01 – Filterung nach Kategorie)
    if (typeof tag === 'string' && tag) {
        query['tags'] = { $in: [tag] };
    }

    // Prioritäts-Filter (FA-02 – Filterung nach Priorität)
    if (typeof priority === 'string' && priority) {
        query['priority'] = priority;
    }

    // Volltextsuche in Titel und Inhalt, case-insensitive (FA-03)
    if (typeof search === 'string' && search) {
        const regex = new RegExp(search, 'i');
        query['$or'] = [{ title: regex }, { content: regex }];
    }

    // Sortierrichtung: 'asc' = aufsteigend, alles andere = absteigend (FA-04)
    const sortOrder: 1 | -1 = sort === 'asc' ? 1 : -1;

    const notes = await Note.find(query)
        .select('_id title tags priority updatedAt createdAt')
        .sort({ updatedAt: sortOrder });

    res.status(200).json({ success: true, count: notes.length, data: notes });
};

// Gibt eine einzelne Notiz zurück – nur wenn sie dem Benutzer gehört (US-04, FA-08)

export const getNoteById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    // MongoDB-ID-Format prüfen
    if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Ungültige Notiz-ID.' });
        return;
    }

    const note = await Note.findById(id);

    // Notiz nicht gefunden oder gehört einem anderen Benutzer (US-04, FA-08)
    if (!note || note.user.toString() !== req.user!._id.toString()) {
        res.status(404).json({ success: false, message: 'Notiz nicht gefunden.' });
        return;
    }

    res.status(200).json({ success: true, data: note });
};

// Aktualisiert eine Notiz, nur wenn sie dem Benutzer gehört (US-06, US-11, FA-08)

export const updateNote = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    // ID-Format prüfen
    if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Ungültige Notiz-ID.' });
        return;
    }

    const note = await Note.findById(id);

    // Notiz nicht gefunden oder gehört anderem Benutzer (FA-08)
    if (!note || note.user.toString() !== req.user!._id.toString()) {
        res.status(404).json({ success: false, message: 'Notiz nicht gefunden.' });
        return;
    }

    const { title, content, tags, priority, reminderDate, customFields, checklist } = req.body;

    // Nur übergebene Felder aktualisieren – alle optionalen Felder erlaubt (US-06, US-11)
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (tags !== undefined) note.tags = tags;
    if (priority !== undefined) note.priority = priority;
    if (reminderDate !== undefined) note.reminderDate = reminderDate;
    if (customFields !== undefined) note.customFields = new Map(Object.entries(customFields));
    if (checklist !== undefined) note.checklist = checklist;

    // Mongoose-Validierung greift beim Speichern (NFA-02)
    try {
        const updated = await note.save();
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error instanceof Error ? error.message : 'Validierungsfehler.',
        });
    }
};

// Löscht eine Notiz endgültig, nur wenn sie dem Benutzer gehört (US-07, FA-08)
export const deleteNote = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    // ID-Format prüfen
    if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Ungültige Notiz-ID.' });
        return;
    }

    const note = await Note.findById(id);

    // Notiz nicht gefunden oder gehört anderem Benutzer (FA-08, US-07)
    if (!note || note.user.toString() !== req.user!._id.toString()) {
        res.status(404).json({ success: false, message: 'Notiz nicht gefunden.' });
        return;
    }

    // Notiz endgültig löschen (US-07)
    await note.deleteOne();

    res.status(200).json({ success: true, message: 'Notiz erfolgreich gelöscht.' });
};
