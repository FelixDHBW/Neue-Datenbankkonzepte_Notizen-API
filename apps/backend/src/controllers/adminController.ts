import { Request, Response } from 'express';
import { adminService } from '../services/index.js';

// Liste aller registrierten Benutzer (US-13)
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    const users = await adminService.getAllUsers();
    res.status(200).json({ success: true, count: users.length, data: users });
};

// Benutzer löschen inkl. aller zugehörigen Notizen (US-14, Rollenmodell)
export const manageUserStatus = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params['id'] ?? '');

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
};

// Alle Notizen systemweit inkl. Benutzerinformation (US-15)
export const getAllNotesAdmin = async (_req: Request, res: Response): Promise<void> => {
    const notes = await adminService.getAllNotes();
    res.status(200).json({ success: true, count: notes.length, data: notes });
};

// Systemweite Statistiken: Anzahl Benutzer und Notizen
export const getStats = async (_req: Request, res: Response): Promise<void> => {
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
};

// Anzahl der Notizen eines bestimmten Benutzers
export const getNoteCountByUser = async (req: Request, res: Response): Promise<void> => {
    const id = String(req.params['id'] ?? '');

    const count = await adminService.getNoteCountByUser(id);

    res.status(200).json({
        success: true,
        data: {
            userId: id,
            noteCount: count,
        },
    });
};
