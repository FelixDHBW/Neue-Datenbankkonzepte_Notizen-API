import { authService } from '../../services/authService';
import User from '../../models/User';

describe('AuthService', () => {
    describe('register', () => {
        it('should register a new user successfully', async () => {
            const result = await authService.register({
                email: 'test@example.com',
                password: 'Password123!'
            });

            expect(result.success).toBe(true);
            expect(result.user).toBeDefined();
            expect(result.user?.email).toBe('test@example.com');
            expect(result.token).toBeDefined();
        });

        it('should fail if email already exists', async () => {
            // Ersten Benutzer erstellen
            await authService.register({
                email: 'duplicate@example.com',
                password: 'Password123!'
            });

            // Zweiten Versuch mit gleicher E-Mail
            const result = await authService.register({
                email: 'duplicate@example.com',
                password: 'Password123!'
            });

            expect(result.success).toBe(false);
            expect(result.error).toContain('existiert bereits');
        });
    });

    describe('login', () => {
        beforeEach(async () => {
            await authService.register({
                email: 'login@example.com',
                password: 'Password123!'
            });
        });

        it('should login with valid credentials', async () => {
            const result = await authService.login({
                email: 'login@example.com',
                password: 'Password123!'
            });

            expect(result.success).toBe(true);
            expect(result.token).toBeDefined();
            expect(result.user).toBeDefined();
        });

        it('should fail with invalid password', async () => {
            const result = await authService.login({
                email: 'login@example.com',
                password: 'WrongPassword123!'
            });

            expect(result.success).toBe(false);
            expect(result.error).toContain('Ungültige Anmeldedaten');
        });

        it('should fail with non-existent email', async () => {
            const result = await authService.login({
                email: 'nonexistent@example.com',
                password: 'Password123!'
            });

            expect(result.success).toBe(false);
            expect(result.error).toContain('Ungültige Anmeldedaten');
        });
    });
});
