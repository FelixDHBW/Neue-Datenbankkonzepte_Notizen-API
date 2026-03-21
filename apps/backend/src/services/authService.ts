import jwt from 'jsonwebtoken';
import User, { IUser, UserRole } from '../models/User';

// Interface für Registrierungsdaten
export interface IRegisterData {
    email: string;
    password: string;
}

// Interface für Anmeldedaten
export interface ILoginData {
    email: string;
    password: string;
}

// Interface für das Registrierungsergebnis
export interface IRegisterResult {
    success: boolean;
    message: string;
    user?: {
        id: string;
        email: string;
        role: UserRole;
        createdAt: Date;
    };
}

// Interface für das Anmeldeergebnis
export interface ILoginResult {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: string;
        email: string;
        role: UserRole;
    };
}

/**
 * Service für Authentifizierungs-Operationen
 * Kapselt die Geschäftslogik für Registrierung und Login
 */
export class AuthService {
    /**
     * Registriert einen neuen Benutzer
     */
    async register(data: IRegisterData): Promise<IRegisterResult> {
        const { email, password } = data;

        // E-Mail-Einzigartigkeit prüfen
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                success: false,
                message: 'Ein Konto mit dieser E-Mail-Adresse existiert bereits.',
            };
        }

        // Benutzer erstellen – Passwort wird automatisch gehasht
        const user = await User.create({ email, password });

        return {
            success: true,
            message: 'Registrierung erfolgreich.',
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
        };
    }

    /**
     * Meldet einen Benutzer an und gibt einen JWT zurück
     */
    async login(data: ILoginData): Promise<ILoginResult> {
        const { email, password } = data;

        // Benutzer suchen, Passwort-Hash explizit einschließen
        const user = await User.findOne({ email }).select('+password');

        // Passwort prüfen
        if (!user || !(await user.comparePassword(password))) {
            return {
                success: false,
                message: 'Ungültige Anmeldedaten.',
            };
        }

        // JWT erstellen
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('Serverkonfigurationsfehler: JWT_SECRET nicht gesetzt.');
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            jwtSecret,
            { expiresIn: '8h' }
        );

        return {
            success: true,
            message: 'Anmeldung erfolgreich.',
            token,
            user: {
                id: user._id.toString(),
                email: user.email,
                role: user.role,
            },
        };
    }

    /**
     * Prüft, ob ein Benutzer mit der gegebenen E-Mail existiert
     */
    async userExists(email: string): Promise<boolean> {
        const user = await User.findOne({ email });
        return !!user;
    }

    /**
     * Sucht einen Benutzer anhand seiner ID
     */
    async findUserById(userId: string): Promise<IUser | null> {
        return User.findById(userId);
    }
}

// Singleton-Instanz für einfachen Zugriff
export const authService = new AuthService();
