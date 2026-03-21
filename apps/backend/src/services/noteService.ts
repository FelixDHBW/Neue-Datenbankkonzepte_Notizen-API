import mongoose, { Types } from 'mongoose';
import Note, { INote, NotePriority } from '../models/Note';

// Interface für Filter-Optionen beim Abrufen von Notizen
export interface INoteFilterOptions {
    tag?: string;
    priority?: string;
    search?: string;
    sort?: 'asc' | 'desc';
}

// Interface für die Erstellung einer Notiz
export interface ICreateNoteData {
    title: string;
    content: string;
    tags?: string[];
    priority?: NotePriority | null;
    reminderDate?: Date | null;
    customFields?: Record<string, unknown>;
    checklist?: Array<{ text: string; isCompleted: boolean }>;
}

// Interface für die Aktualisierung einer Notiz
export interface IUpdateNoteData {
    title?: string;
    content?: string;
    tags?: string[];
    priority?: NotePriority | null;
    reminderDate?: Date | null;
    customFields?: Record<string, unknown>;
    checklist?: Array<{ text: string; isCompleted: boolean }>;
}

/**
 * Service für Notiz-Operationen
 * Kapselt die Geschäftslogik für das Erstellen, Lesen, Aktualisieren und Löschen von Notizen
 */
export class NoteService {
    /**
     * Erstellt eine neue Notiz für einen Benutzer
     */
    async createNote(userId: Types.ObjectId, data: ICreateNoteData): Promise<INote> {
        const note = await Note.create({
            user: userId,
            title: data.title,
            content: data.content,
            tags: data.tags ?? [],
            priority: data.priority ?? null,
            reminderDate: data.reminderDate ?? null,
            customFields: data.customFields ?? {},
            checklist: data.checklist ?? [],
        });

        return note;
    }

    /**
     * Ruft alle Notizen eines Benutzers mit optionalen Filtern ab
     */
    async getNotes(userId: Types.ObjectId, options: INoteFilterOptions = {}): Promise<INote[]> {
        const { tag, priority, search, sort } = options;

        // Basis-Filter: nur Notizen des aktuellen Benutzers
        const query: Record<string, unknown> = { user: userId };

        // Tag-Filter
        if (tag) {
            query['tags'] = { $in: [tag] };
        }

        // Prioritäts-Filter
        if (priority) {
            query['priority'] = priority;
        }

        // Volltextsuche in Titel und Inhalt
        if (search) {
            const regex = new RegExp(search, 'i');
            query['$or'] = [{ title: regex }, { content: regex }];
        }

        // Sortierrichtung
        const sortOrder: 1 | -1 = sort === 'asc' ? 1 : -1;

        const notes = await Note.find(query)
            .select('_id title tags priority updatedAt createdAt')
            .sort({ updatedAt: sortOrder });

        return notes;
    }

    /**
     * Ruft eine einzelne Notiz anhand ihrer ID ab
     * Prüft, ob die Notiz dem angegebenen Benutzer gehört
     */
    async getNoteById(noteId: string, userId: Types.ObjectId): Promise<INote | null> {
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return null;
        }

        const note = await Note.findById(noteId);

        if (!note || note.user.toString() !== userId.toString()) {
            return null;
        }

        return note;
    }

    /**
     * Aktualisiert eine Notiz
     * Prüft, ob die Notiz dem angegebenen Benutzer gehört
     */
    async updateNote(
        noteId: string,
        userId: Types.ObjectId,
        data: IUpdateNoteData
    ): Promise<INote | null> {
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return null;
        }

        const note = await Note.findById(noteId);

        if (!note || note.user.toString() !== userId.toString()) {
            return null;
        }

        // Nur übergebene Felder aktualisieren
        if (data.title !== undefined) note.title = data.title;
        if (data.content !== undefined) note.content = data.content;
        if (data.tags !== undefined) note.tags = data.tags;
        if (data.priority !== undefined) note.priority = data.priority;
        if (data.reminderDate !== undefined) note.reminderDate = data.reminderDate;
        if (data.customFields !== undefined) {
            note.customFields = new Map(Object.entries(data.customFields));
        }
        if (data.checklist !== undefined) note.checklist = data.checklist;

        const updated = await note.save();
        return updated;
    }

    /**
     * Löscht eine Notiz
     * Prüft, ob die Notiz dem angegebenen Benutzer gehört
     */
    async deleteNote(noteId: string, userId: Types.ObjectId): Promise<INote | null> {
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return null;
        }

        const note = await Note.findById(noteId);

        if (!note || note.user.toString() !== userId.toString()) {
            return null;
        }

        await note.deleteOne();
        return note;
    }

    /**
     * Prüft, ob eine Notiz-ID gültig ist
     */
    isValidNoteId(noteId: string): boolean {
        return mongoose.Types.ObjectId.isValid(noteId);
    }
}

// Singleton-Instanz für einfachen Zugriff
export const noteService = new NoteService();
