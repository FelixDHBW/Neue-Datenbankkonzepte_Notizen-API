import { Request, Response } from 'express';
import User from '../models/User';

/**
 * POST /api/auth/register
 * Registriert einen neuen Benutzer (US-01)
 */
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Pflichtfelder prüfen (US-01)
    if (!email || !password) {
        res.status(400).json({ success: false, message: 'E-Mail und Passwort sind Pflichtfelder.' });
        return;
    }

    // E-Mail-Einzigartigkeit prüfen (US-01)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(409).json({ success: false, message: 'Ein Konto mit dieser E-Mail-Adresse existiert bereits.' });
        return;
    }

    // Benutzer erstellen – Passwort wird automatisch gehasht (NFA-04, pre-save Hook)
    const user = await User.create({ email, password });

    // Erfolgsantwort ohne Passwort-Hash (FA-05)
    res.status(201).json({
        success: true,
        message: 'Registrierung erfolgreich.',
        data: {
            id: user._id,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
    });
};
