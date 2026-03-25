import { Request, Response } from 'express';
import { authService } from '../services/index.js';

// Registriert einen neuen Benutzer (US-01)
export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Pflichtfelder prüfen (US-01)
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: 'E-Mail und Passwort sind Pflichtfelder.',
        });
        return;
    }

    const result = await authService.register({ email, password });

    if (!result.success) {
        // E-Mail bereits vergeben (US-01)
        res.status(409).json({ success: false, message: result.message });
        return;
    }

    // Erfolgsantwort ohne Passwort-Hash (FA-05)
    res.status(201).json({
        success: true,
        message: result.message,
        data: result.user,
    });
};

// Meldet einen Benutzer an und gibt einen JWT zurück (US-02)
export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Pflichtfelder prüfen (US-02)
    if (!email || !password) {
        res.status(400).json({
            success: false,
            message: 'E-Mail und Passwort sind Pflichtfelder.',
        });
        return;
    }

    try {
        const result = await authService.login({ email, password });

        if (!result.success) {
            // Allgemeine Fehlermeldung, kein Hinweis ob E-Mail oder Passwort falsch (US-02, FA-06)
            res.status(401).json({ success: false, message: result.message });
            return;
        }

        // Token und Benutzerinfo zurückgeben (FA-07)
        res.status(200).json({
            success: true,
            message: result.message,
            token: result.token,
            data: result.user,
        });
    } catch {
        res.status(500).json({ success: false, message: 'Serverkonfigurationsfehler.' });
    }
};
