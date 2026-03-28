import { Request, Response } from 'express';
import { adminService } from '../services/index.js';

// Benutzer sperren (isActive = false) (US-14)
export const banUser = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params['id'] ?? '');

    try {
        const result = await adminService.banUser(id, req.user!._id.toString());

        if (!result.success) {
            const status = result.message === 'Benutzer nicht gefunden.' ? 404 : 400;
            res.status(status).json({ success: false, message: result.message });
            return;
        }

        res.status(200).json({ success: true, message: result.message, data: result.user });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Fehler beim Sperren des Benutzers.',
        });
    }
};

// Benutzer entsperren (isActive = true) (US-14)
export const unbanUser = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params['id'] ?? '');

    try {
        const result = await adminService.unbanUser(id);

        if (!result.success) {
            const status = result.message === 'Benutzer nicht gefunden.' ? 404 : 400;
            res.status(status).json({ success: false, message: result.message });
            return;
        }

        res.status(200).json({ success: true, message: result.message, data: result.user });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Fehler beim Entsperren des Benutzers.',
        });
    }
};

// Liste aller registrierten Benutzer (US-13)
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    try {
        const users = await adminService.getAllUsers();
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Fehler beim Laden der Benutzer.',
        });
    }
};

// Benutzer löschen inkl. aller zugehörigen Notizen (US-14, Rollenmodell)
export const deleteUserById = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params['id'] ?? '');

    try {
        const result = await adminService.deleteUser(id, req.user!._id.toString());

        if (!result.success) {
            // Unterscheide zwischen ungültiger ID (400), nicht gefunden (404) und Selbstlöschung (400)
            const status = result.message === 'Benutzer nicht gefunden.' ? 404 : 400;
            res.status(status).json({ success: false, message: result.message });
            return;
        }

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Fehler beim Löschen des Benutzers.',
        });
    }
};

// Alle Notizen systemweit inkl. Benutzerinformation (US-15)
export const getAllNotesAdmin = async (_req: Request, res: Response): Promise<void> => {
    try {
        const notes = await adminService.getAllNotes();
        res.status(200).json({ success: true, count: notes.length, data: notes });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Fehler beim Laden der Notizen.',
        });
    }
};

// Systemweite Statistiken: Anzahl Benutzer und Notizen
export const getStats = async (_req: Request, res: Response): Promise<void> => {
    try {
        const [userCount, noteCount] = await Promise.all([
            adminService.getUserCount(),
            adminService.getNoteCount(),
        ]);

        res.status(200).json({
            success: true,
            data: {
                userCount,
                noteCount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Fehler beim Laden der Statistiken.',
        });
    }
};

// Anzahl der Notizen eines bestimmten Benutzers
export const getNoteCountByUser = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params['id'] ?? '');

    try {
        const count = await adminService.getNoteCountByUser(id);

        res.status(200).json({
            success: true,
            data: {
                userId: id,
                noteCount: count,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Fehler beim Laden der Notizanzahl.',
        });
    }
};
