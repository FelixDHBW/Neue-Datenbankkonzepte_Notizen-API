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
