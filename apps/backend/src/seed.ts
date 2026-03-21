import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { UserRole } from './models/User';
import Note, { NotePriority } from './models/Note';

// Konfiguration laden, damit prozess.env.MONGO_URI zur Verfügung steht
dotenv.config();

const seedDB = async () => {
    try {
        console.log('Starte Datenbank-Seeding...');

        // Verbindung herstellen
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('Fehler: MONGO_URI in .env nicht gefunden.');
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log(`Datenbank verbunden: ${mongoose.connection.host}`);

        // Bereinigung der bestehenden Daten
        console.log('Lösche bestehende Daten...');
        await User.deleteMany({});
        await Note.deleteMany({});
        console.log('Datenbereinigung abgeschlossen.');

        // Admin-Benutzer erstellen
        await User.create({
            email: 'admin@example.com',
            password: 'AdminPassword123!',
            role: UserRole.ADMINISTRATOR,
        });
        console.log('Admin-Benutzer erfolgreich erstellt.');

        // Benutzer erstellen
        const regularUser = await User.create({
            email: 'user@example.com',
            password: 'UserPassword123!',
            role: UserRole.BENUTZER,
        });
        console.log('Regulärer Benutzer erfolgreich erstellt.');

        //Notiz-Seeding für den regulären User erstellen
        const notesToSeed = [
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
                    ['store', 'Rewe & Getränkemarkt'],
                    ['guestsInfo', { expected: 15, confirmed: 12 }]
                ])
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
                    ['kostenSchätzung', 800],
                    ['links', ['https://prusa3d.com', 'https://thingiverse.com']]
                ])
            }
        ];

        await Note.insertMany(notesToSeed);
        console.log(`${notesToSeed.length} Notizen für den regulären Benutzer erfolgreich erstellt.`);

        console.log('Seeding erfolgreich abgeschlossen!');
        process.exit(0);

    } catch (error) {
        if (error instanceof Error) {
            console.error(`Fehler beim Seeding: ${error.message}`);
        } else {
            console.error(` Unerwarteter Fehler beim Seeding:`, error);
        }
        process.exit(1);
    }
};

seedDB();
