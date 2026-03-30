import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname in ES Modulen
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Umgebungsvariablen laden (NFA-01) - Pfad relativ zur kompilierten Datei
const envPath = path.resolve(__dirname, '../.env');
dotenv.config({ path: envPath });

import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import User, { UserRole } from './models/User.js';
import Note, { NotePriority } from './models/Note.js';

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors()); // CORS für Cross-Origin-Anfragen aktivieren (NFA-01)
app.use(express.json()); // JSON-Body-Parsing aktivieren

app.use('/api/auth', authRoutes);

app.use('/api/notes', noteRoutes);

app.use('/api/admin', adminRoutes);

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Führt das Datenbank-Seeding automatisch durch,
 * wenn noch keine Benutzer in der Datenbank vorhanden sind.
 */
const runSeedIfEmpty = async (): Promise<void> => {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
        console.log(`Datenbank enthält bereits ${userCount} Benutzer – Seeding übersprungen.`);
        return;
    }

    console.log('Datenbank ist leer – starte automatisches Seeding...');

    // Admin-Benutzer erstellen
    await User.create({
        email: 'admin@example.com',
        password: 'AdminPassword123!',
        role: UserRole.ADMINISTRATOR,
    });
    console.log('Admin-Benutzer erfolgreich erstellt.');

    // Regulären Benutzer erstellen
    const regularUser = await User.create({
        email: 'user@example.com',
        password: 'UserPassword123!',
        role: UserRole.BENUTZER,
    });
    console.log('Regulärer Benutzer erfolgreich erstellt.');

    // Beispiel-Notizen für den regulären Benutzer
    await Note.insertMany([
        {
            user: regularUser._id,
            title: 'Einkaufsliste Wochenende',
            content: 'Dinge, die für die Party besorgt werden müssen.',
            tags: ['Privat', 'Einkauf', 'Wochenende'],
            priority: NotePriority.HIGH,
            checklist: [
                { text: 'Getränke (Bier, Cola, Wasser)', isCompleted: false },
                { text: 'Snacks (Chips, Nüsse)', isCompleted: true },
                { text: 'Grillfleisch', isCompleted: false },
            ],
            customFields: new Map<string, unknown>([
                ['budget', '150 EUR'],
                ['einkaufsort', 'Rewe & Getränkemarkt'],
                ['erwarteteGäste', 15],
                ['bestätigteGäste', 12],
            ]),
        },
        {
            user: regularUser._id,
            title: 'Meeting Notizen: Projekt X',
            content: 'Besprechung der neuen Architektur. Frontend wird in Vue umgesetzt.',
            tags: ['Arbeit', 'Projekt X', 'Frontend'],
            priority: NotePriority.MEDIUM,
            reminderDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            checklist: [
                { text: 'Architekturskizze fertigen', isCompleted: true },
                { text: 'Vue.js Setup evaluieren', isCompleted: false },
            ],
        },
        {
            user: regularUser._id,
            title: 'Idee für neues Hobby',
            content: 'Vielleicht sollte ich mit dem 3D-Druck anfangen?',
            tags: ['Ideen', 'Hobby'],
            priority: NotePriority.LOW,
            customFields: new Map<string, unknown>([
                ['druckerModell', 'Prusa i3 MK3S+'],
                ['kostenSchätzung', '800 EUR'],
                ['link1', 'https://prusa3d.com'],
                ['link2', 'https://thingiverse.com'],
            ]),
        },
    ]);

    console.log('3 Beispiel-Notizen erfolgreich erstellt.');
    console.log('');
    console.log('Seeding abgeschlossen! Anmeldedaten:');
    console.log('  Admin:    admin@example.com  /  AdminPassword123!');
    console.log('  Benutzer: user@example.com   /  UserPassword123!');
};

const start = async (): Promise<void> => {
    await connectDB();
    await runSeedIfEmpty();
    app.listen(PORT, () => {
        console.log(`Server läuft auf Port ${PORT}`);
    });
};

start();
