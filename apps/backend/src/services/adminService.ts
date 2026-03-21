import mongoose from 'mongoose';
import User, { UserRole } from '../models/User';
import Note from '../models/Note';

// Interface für Benutzer-Informationen (ohne Passwort)
export interface IUserInfo {
    id: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}

// Interface für Notiz-Informationen mit Benutzer-Details
export interface INoteWithUserInfo {
    _id: string;
    title: string;
    tags: string[];
    priority?: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        email: string;
        role: UserRole;
    };
}

// Interface für das Lösch-Ergebnis
export interface IDeleteUserResult {
    success: boolean;
    message: string;
    deletedUser?: IUserInfo;
}

/**
 * Service für Admin-Operationen
 * Kapselt die Geschäftslogik für Benutzer- und Notiz-Verwaltung durch Administratoren
 */
export class AdminService {
    /**
     * Ruft alle registrierten Benutzer ab (ohne Passwort-Hash)
     */
    async getAllUsers(): Promise<IUserInfo[]> {
        const users = await User.find().select('_id email role createdAt');

        return users.map(user => ({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        }));
    }

    /**
     * Löscht einen Benutzer inklusive aller zugehörigen Notizen
     */
    async deleteUser(userId: string, adminUserId: string): Promise<IDeleteUserResult> {
        // ID-Format validieren
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return {
                success: false,
                message: 'Ungültige Benutzer-ID.',
            };
        }

        const user = await User.findById(userId);
        if (!user) {
            return {
                success: false,
                message: 'Benutzer nicht gefunden.',
            };
        }

        // Admin darf sich nicht selbst löschen
        if (user._id.toString() === adminUserId) {
            return {
                success: false,
                message: 'Eigenes Konto kann nicht gelöscht werden.',
            };
        }

        const userInfo: IUserInfo = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };

        // Alle Notizen des Benutzers löschen
        await Note.deleteMany({ user: user._id });

        // Benutzer löschen
        await user.deleteOne();

        return {
            success: true,
            message: `Benutzer ${user.email} und alle zugehörigen Notizen wurden gelöscht.`,
            deletedUser: userInfo,
        };
    }

    /**
     * Ruft alle Notizen systemweit ab inklusive Benutzerinformationen
     */
    async getAllNotes(): Promise<INoteWithUserInfo[]> {
        const notes = await Note.find()
            .select('_id title tags priority createdAt updatedAt user')
            .populate('user', 'email role');

        return notes.map(note => {
            const user = note.user as unknown as { email: string; role: UserRole };
            return {
                _id: note._id.toString(),
                title: note.title,
                tags: note.tags,
                priority: note.priority,
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
                user: {
                    email: user.email,
                    role: user.role,
                },
            };
        });
    }

    /**
     * Zählt die Anzahl der registrierten Benutzer
     */
    async getUserCount(): Promise<number> {
        return User.countDocuments();
    }

    /**
     * Zählt die Anzahl aller Notizen im System
     */
    async getNoteCount(): Promise<number> {
        return Note.countDocuments();
    }

    /**
     * Zählt die Notizen pro Benutzer
     */
    async getNoteCountByUser(userId: string): Promise<number> {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return 0;
        }
        return Note.countDocuments({ user: userId });
    }
}

// Singleton-Instanz für einfachen Zugriff
export const adminService = new AdminService();
