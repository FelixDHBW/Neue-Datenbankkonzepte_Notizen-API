import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

 //Registriert einen neuen Benutzer (US-01)

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

    // Benutzer erstellen – Passwort wird automatisch gehasht (NFA-04)
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


//Meldet einen Benutzer an und gibt einen JWT zurück (US-02)

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Pflichtfelder prüfen (US-02)
    if (!email || !password) {
        res.status(400).json({ success: false, message: 'E-Mail und Passwort sind Pflichtfelder.' });
        return;
    }

    // Benutzer suchen, Passwort-Hash explizit einschließen (FA-06)
    const user = await User.findOne({ email }).select('+password');

    // Allgemeine Fehlermeldung, kein Hinweis ob E-Mail oder Passwort falsch (US-02, FA-06)
    if (!user || !(await user.comparePassword(password))) {
        res.status(401).json({ success: false, message: 'Ungültige Anmeldedaten.' });
        return;
    }

    // JWT mit id und role signieren (FA-07)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        res.status(500).json({ success: false, message: 'Serverkonfigurationsfehler.' });
        return;
    }

    const token = jwt.sign(
        { id: user._id, role: user.role }, // Payload: Benutzer-ID und Rolle (FA-07)
        jwtSecret,
        { expiresIn: '8h' }                // Token läuft nach 8 Stunden ab
    );

    // Token und Benutzerinfo zurückgeben (FA-07)
    res.status(200).json({
        success: true,
        message: 'Anmeldung erfolgreich.',
        token,
        data: {
            id: user._id,
            email: user.email,
            role: user.role,
        },
    });
};
