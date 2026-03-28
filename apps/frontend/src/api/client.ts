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
            // Bei 401 (Token ungültig/abgelaufen) oder 403 (Konto gesperrt) Token entfernen
            if (response.status === 401 || response.status === 403) {
                removeToken();
            }
            return {
                success: false,
                message: data.message || `Fehler: ${response.status}`,
                // unauthorized=true bei 401 und 403 → löst Redirect zur Login-Seite aus
                ...((response.status === 401 || response.status === 403) && { unauthorized: true }),
            } as ApiResponse<T>;
        }

        return data;
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Netzwerkfehler',
        };
    }
}
