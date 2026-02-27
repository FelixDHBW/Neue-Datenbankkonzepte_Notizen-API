import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import noteRoutes from './routes/noteRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config(); // Umgebungsvariablen laden (NFA-01)

const app = express();
const PORT = process.env.PORT ?? 5000;

app.use(cors()); // CORS für Cross-Origin-Anfragen aktivieren (NFA-01)
app.use(express.json()); // JSON-Body-Parsing aktivieren

/** Auth-Routen unter /api/auth einbinden (US-01, FA-05) */
app.use('/api/auth', authRoutes);

/** Notiz-Routen unter /api/notes einbinden – JWT-geschützt (FA-07, FA-08, US-03, US-04, US-05) */
app.use('/api/notes', noteRoutes);

/** Admin-Routen unter /api/admin einbinden – nur Administratoren (US-13, US-14, US-15) */
app.use('/api/admin', adminRoutes);

/** Gesundheitscheck */
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});


/** Server starten nach DB-Verbindung */
const start = async (): Promise<void> => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server läuft auf Port ${PORT}`);
    });
};

start();
