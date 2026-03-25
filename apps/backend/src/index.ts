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

const start = async (): Promise<void> => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Server läuft auf Port ${PORT}`);
    });
};

start();
