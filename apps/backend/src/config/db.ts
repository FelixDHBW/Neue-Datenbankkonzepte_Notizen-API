import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            console.error('Fehler: MONGO_URI ist nicht in den Umgebungsvariablen definiert.');
            process.exit(1);
        }

        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB verbunden: ${conn.connection.host}`);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Fehler: ${error.message}`);
        } else {
            console.error(`Fehler: ${error}`);
        }
        process.exit(1);
    }
};

export default connectDB;
