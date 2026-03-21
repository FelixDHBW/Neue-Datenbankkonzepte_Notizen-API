import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;

// Verbindung zur In-Memory-Datenbank vor allen Tests herstellen
beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
});

// Datenbank nach allen Tests schließen
afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
});

// Collections nach jedem Test leeren
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
