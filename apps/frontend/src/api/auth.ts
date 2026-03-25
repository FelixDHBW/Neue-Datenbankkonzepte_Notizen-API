// ============================================
// Auth-API: Login & Registrierung
// ============================================

import { fetchApi, setToken } from './client';
import type { LoginData, RegisterData, AuthResponse, ApiResponse } from '../types';

export const login = async (
    data: LoginData
): Promise<ApiResponse<AuthResponse>> => {
    const result = await fetchApi<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });

    const token = result.token || result.data?.token;
    if (result.success && token) {
        setToken(token);
    }

    return result;
};

export const register = async (
    data: RegisterData
): Promise<ApiResponse<{ id: string; email: string; role: string }>> => {
    return await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};
