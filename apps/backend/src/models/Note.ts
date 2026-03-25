import mongoose, { Document, Schema, Types } from 'mongoose';

// --- Typen & Interfaces ---

// Interface für ein Checklist-Element (US-12)
export interface IChecklistItem {
    text: string;
    isCompleted: boolean;
}

// Erlaubte Prioritätswerte (US-09)
export enum NotePriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

// Interface für ein vollständiges Notiz-Dokument
export interface INote extends Document {
    user: Types.ObjectId;
    title: string;
    content: string;
    tags: string[];
    priority?: NotePriority;
    reminderDate?: Date;
    customFields: Map<string, unknown>;
    checklist: IChecklistItem[];
    createdAt: Date;
    updatedAt: Date;
}

const ChecklistItemSchema = new Schema<IChecklistItem>(
    {
        text: { type: String, required: [true, 'Checklist-Text ist ein Pflichtfeld.'] },
        isCompleted: { type: Boolean, default: false },
    },
    { _id: false } // Keine eigene ID für Subdokumente
);

const NoteSchema = new Schema<INote>(
    {
        // Besitzer der Notiz, erzwingt Datenisolation (FA-08, US-03)
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Eine Notiz muss einem Benutzer zugeordnet sein.'],
        },

        // Titel der Notiz, Pflichtfeld (US-03)
        title: {
            type: String,
            required: [true, 'Titel ist ein Pflichtfeld.'],
            trim: true,
        },

        // Inhalt der Notiz, Pflichtfeld (US-03)
        content: {
            type: String,
            required: [true, 'Inhalt ist ein Pflichtfeld.'],
        },

        // Optionale Tags für Kategorisierung (US-08)
        tags: {
            type: [String],
            default: [],
        },

        // Priorität: 'low' | 'medium' | 'high', optional (US-09, NFA-02)
        priority: {
            type: String,
            enum: {
                values: Object.values(NotePriority),
                message: "Priorität muss 'low', 'medium' oder 'high' sein.",
            },
            default: null,
        },

        // Erinnerungsdatum, optional (US-10)
        reminderDate: {
            type: Date,
            default: null,
        },

        // Flexible Schlüssel-Wert-Paare für Zusatzfelder (US-11)
        customFields: {
            type: Map,
            of: Schema.Types.Mixed,
            default: {},
        },

        // Verschachtelte Checkliste (US-12)
        checklist: {
            type: [ChecklistItemSchema],
            default: [],
        },
    },
    {
        // Fügt createdAt und updatedAt automatisch hinzu (US-05)
        timestamps: true,
    }
);

const Note = mongoose.model<INote>('Note', NoteSchema);

export default Note;
