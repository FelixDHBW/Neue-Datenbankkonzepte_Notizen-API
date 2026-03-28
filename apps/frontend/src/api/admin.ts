// ============================================
// Admin-API: Benutzer- & Notizenverwaltung
// ============================================

import { fetchApi } from './client';
import type { User, Note, ApiResponse } from '../types';

// Typ für Admin-Notizen: user ist ein eingebettetes Objekt {email, role}, kein vollständiges User-Objekt
export interface AdminNote extends Omit<Note, 'user'> {
    user?: { email: string; role: string };
}

export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
    return await fetchApi<User[]>('/admin/users');
};

export const getStats = async (): Promise<ApiResponse<{ userCount: number; noteCount: number }>> => {
    return await fetchApi<{ userCount: number; noteCount: number }>('/admin/stats');
};

export const deleteUser = async (id: string): Promise<ApiResponse> => {
    return await fetchApi(`/admin/users/${id}`, {
        method: 'DELETE',
    });
};

export const banUser = async (id: string): Promise<ApiResponse<User>> => {
    return await fetchApi<User>(`/admin/users/${id}/ban`, {
        method: 'PATCH',
    });
};

export const unbanUser = async (id: string): Promise<ApiResponse<User>> => {
    return await fetchApi<User>(`/admin/users/${id}/unban`, {
        method: 'PATCH',
    });
};

export const getAllNotesAdmin = async (): Promise<ApiResponse<AdminNote[]>> => {
    return await fetchApi<AdminNote[]>('/admin/notes');
};
