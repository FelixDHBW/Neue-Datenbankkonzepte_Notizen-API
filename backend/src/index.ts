import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 5000;

/** JSON-Body-Parsing aktivieren */
app.use(express.json());

/** Auth-Routen einbinden */
app.use('/api/auth', authRoutes);

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
