import { noteService } from '../../services/noteService';
import Note from '../../models/Note';
import User from '../../models/User';
import mongoose from 'mongoose';

describe('NoteService', () => {
    let userId: string;

    beforeEach(async () => {
        const user = await User.create({
            email: 'test@example.com',
            password: 'hashedPassword123',
        });
        userId = user._id.toString();
    });

    describe('createNote', () => {
        it('should create a note successfully', async () => {
            const result = await noteService.createNote(userId, {
                title: 'Test Note',
                content: 'Test Content',
            });

            expect(result.success).toBe(true);
            expect(result.note).toBeDefined();
            expect(result.note?.title).toBe('Test Note');
        });

        it('should fail without title', async () => {
            const result = await noteService.createNote(userId, {
                title: '',
                content: 'Test Content',
            });

            expect(result.success).toBe(false);
            expect(result.error).toContain('Titel ist erforderlich');
        });
    });

    describe('getNotesByUser', () => {
        beforeEach(async () => {
            await Note.create([
                { title: 'Note 1', content: 'Content 1', userId },
                { title: 'Note 2', content: 'Content 2', userId },
            ]);
        });

        it('should return all notes for a user', async () => {
            const result = await noteService.getNotesByUser(userId);

            expect(result.success).toBe(true);
            expect(result.notes).toHaveLength(2);
        });

        it('should filter notes by search term', async () => {
            const result = await noteService.getNotesByUser(userId, { search: 'Note 1' });

            expect(result.success).toBe(true);
            expect(result.notes).toHaveLength(1);
            expect(result.notes?.[0].title).toBe('Note 1');
        });
    });

    describe('deleteNote', () => {
        it('should delete own note successfully', async () => {
            const note = await Note.create({
                title: 'To Delete',
                content: 'Content',
                userId,
            });

            const result = await noteService.deleteNote(userId, note._id.toString());

            expect(result.success).toBe(true);
            expect(result.message).toContain('erfolgreich gelöscht');
        });

        it('should fail to delete non-existent note', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();
            const result = await noteService.deleteNote(userId, fakeId);

            expect(result.success).toBe(false);
            expect(result.error).toContain('nicht gefunden');
        });
    });
});
