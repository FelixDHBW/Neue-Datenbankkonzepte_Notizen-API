import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/authRoutes';
import connectDB from '../../config/db';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes Integration', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(app).post('/api/auth/register').send({
                email: 'integration@test.com',
                password: 'Password123!',
            });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
        });

        it('should fail with invalid email', async () => {
            const response = await request(app).post('/api/auth/register').send({
                email: 'invalid-email',
                password: 'Password123!',
            });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app).post('/api/auth/register').send({
                email: 'login@test.com',
                password: 'Password123!',
            });
        });

        it('should login with valid credentials', async () => {
            const response = await request(app).post('/api/auth/login').send({
                email: 'login@test.com',
                password: 'Password123!',
            });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.token).toBeDefined();
        });

        it('should fail with wrong password', async () => {
            const response = await request(app).post('/api/auth/login').send({
                email: 'login@test.com',
                password: 'WrongPassword123!',
            });

            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
        });
    });
});
