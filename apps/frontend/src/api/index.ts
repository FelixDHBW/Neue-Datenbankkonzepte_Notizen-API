// ============================================
// API-Barrel: Alle API-Funktionen re-exportieren
// ============================================

export { getToken, setToken, removeToken } from './client';
export { login, register } from './auth';
export { getNotes, getNoteById, createNote, updateNote, deleteNote } from './notes';
export { getAllUsers, deleteUser, banUser, unbanUser, getAllNotesAdmin, getStats } from './admin';
