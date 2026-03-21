import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// Struktur des JWT-Payloads (FA-07)
interface JwtPayload {
    id: string;
    role: string;
}

// Erweitert Express Request um req.user (FA-07)
declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

/**
 * protect prüft ob ein gültiger JWT im Authorization-Header vorhanden ist (FA-07)
 * Hängt den Benutzer bei Erfolg an req.user an.
 */
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    // Bearer-Token aus dem Header extrahieren
    if (!authHeader?.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Kein Zugriffstoken vorhanden. Zugriff verweigert.' });
        return;
    }

    const token = authHeader.split(' ')[1] ?? '';

    // JWT_SECRET sicher laden, Fehler wenn nicht konfiguriert
    const jwtSecret = String(process.env.JWT_SECRET ?? '');
    if (!jwtSecret) {
        res.status(500).json({ success: false, message: 'Serverkonfigurationsfehler.' });
        return;
    }

    try {
        // Token verifizieren, wirft bei Manipulation oder Ablauf (FA-07)
        const decoded = jwt.verify(token, jwtSecret) as unknown as JwtPayload;

        // Benutzer aus der DB laden und an req hängen
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401).json({ success: false, message: 'Benutzer nicht gefunden. Token ungültig.' });
            return;
        }

        req.user = user;
        next();
    } catch {
        // Manipulierte oder abgelaufene Tokens abfangen (FA-07)
        res.status(401).json({ success: false, message: 'Token ungültig oder abgelaufen. Zugriff verweigert.' });
    }
};
