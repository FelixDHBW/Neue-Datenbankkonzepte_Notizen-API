import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User.js';

/**
 * adminOnly erlaubt den Zugriff nur für Benutzer mit Rolle 'Administrator' (Rollenmodell)
 * Muss nach protect() in der Middleware-Kette stehen.
 */
export const adminOnly = (req: Request, res: Response, next: NextFunction): void => {
    // req.user wird von protect() gesetzt
    if (!req.user || req.user.role !== UserRole.ADMINISTRATOR) {
        res.status(403).json({
            success: false,
            message: 'Zugriff verweigert. Nur Administratoren haben Zugang zu dieser Ressource.',
        });
        return;
    }

    next(); // Rolle 'Administrator' Zugriff gewährt (Rollenmodell)
};
