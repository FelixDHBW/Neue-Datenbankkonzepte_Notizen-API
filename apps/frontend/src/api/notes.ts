// ============================================
// Notizen-API: CRUD-Operationen
// ============================================

import { fetchApi } from './client';
import type { Note, CreateNoteData, UpdateNoteData, ApiResponse } from '../types';

export const getNotes = async (filters?: {
    tag?: string;
    priority?: string;
    search?: string;
    sort?: 'asc' | 'desc';
}): Promise<ApiResponse<Note[]>> => {
    const params = new URLSearchParams();

    if (filters) {
        if (filters.tag) params.append('tag', filters.tag);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.search) params.append('search', filters.search);
        if (filters.sort) params.append('sort', filters.sort);
    }

    const queryString = params.toString();
    const endpoint = queryString ? `/notes?${queryString}` : '/notes';

    return await fetchApi<Note[]>(endpoint);
};

export const getNoteById = async (id: string): Promise<ApiResponse<Note>> => {
    return await fetchApi<Note>(`/notes/${id}`);
};

export const createNote = async (data: CreateNoteData): Promise<ApiResponse<Note>> => {
    return await fetchApi<Note>('/notes', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const updateNote = async (
    id: string,
    data: UpdateNoteData
): Promise<ApiResponse<Note>> => {
    return await fetchApi<Note>(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

export const deleteNote = async (id: string): Promise<ApiResponse> => {
    return await fetchApi(`/notes/${id}`, {
        method: 'DELETE',
    });
};
