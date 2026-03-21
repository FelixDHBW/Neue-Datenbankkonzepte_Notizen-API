import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Note from '../models/Note';

 //Liste aller registrierten Benutzer (US-13)

export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
    // Alle Benutzer abrufen ohne Passwort-Hash (US-13)
    const users = await User.find().select('_id email role createdAt');
    res.status(200).json({ success: true, count: users.length, data: users });
};

//Benutzer löschen inkl. aller zugehörigen Notizen (US-14, Rollenmodell)

export const manageUserStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    // ID-Format validieren
    if (typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: 'Ungültige Benutzer-ID.' });
        return;
    }

    const user = await User.findById(id);
    if (!user) {
        res.status(404).json({ success: false, message: 'Benutzer nicht gefunden.' });
        return;
    }

    // Admin darf sich nicht selbst löschen
    if (user._id.toString() === req.user!._id.toString()) {
        res.status(400).json({ success: false, message: 'Eigenes Konto kann nicht gelöscht werden.' });
        return;
    }

    // Alle Notizen des Benutzers löschen (US-14)
    await Note.deleteMany({ user: user._id });

    // Benutzer löschen (US-14)
    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: `Benutzer ${user.email} und alle zugehörigen Notizen wurden gelöscht.`,
    });
};

// Alle Notizen systemweit inkl. Benutzerinformation (US-15)

export const getAllNotesAdmin = async (_req: Request, res: Response): Promise<void> => {
    // Systemweite Notizen aller Benutzer mit populated user-Feld (US-15)
    const notes = await Note.find()
        .select('_id title tags priority createdAt updatedAt user')
        .populate('user', 'email role'); // Benutzerinformation anreichern (US-15)

    res.status(200).json({ success: true, count: notes.length, data: notes });
};
