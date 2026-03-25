// ============================================
// HTTP-Client: Token-Verwaltung & fetchApi
// ============================================

import type { ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

export const getToken = (): string | null => localStorage.getItem('token');

export const setToken = (token: string): void => localStorage.setItem('token', token);

export const removeToken = (): void => localStorage.removeItem('token');

export async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, { ...options, headers });
        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || `Fehler: ${response.status}`,
            };
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Netzwerkfehler',
        };
    }
}
