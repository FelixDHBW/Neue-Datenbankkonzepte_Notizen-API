// ============================================
// API-Client für die Notizen-App
// Kommuniziert mit dem Express-Backend
// ============================================

// Basis-URL des Backends
const API_BASE_URL = 'http://localhost:5000/api';

// Token aus dem localStorage holen
const getToken = (): string | null => {
    return localStorage.getItem('token');
};

// Token speichern
export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

// Token löschen (Logout)
export const removeToken = (): void => {
    localStorage.removeItem('token');
};

// Hilfsfunktion für API-Requests
async function fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string }> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Standard-Headers
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((options.headers as Record<string, string>) || {}),
    };

    // Auth-Token hinzufügen wenn vorhanden
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        // JSON-Response parsen
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

// ============================================
// AUTHENTIFIZIERUNG
// ============================================

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    data: {
        id: string;
        email: string;
        role: string;
    };
}

// Login
export const login = async (
    data: LoginData
): Promise<{ success: boolean; data?: AuthResponse; message?: string }> => {
    console.log('API: Login-Aufruf mit:', data.email);
    const result = await fetchApi<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
    });
    console.log('API: Login-Antwort:', result);

    if (result.success && result.data) {
        console.log('API: Token wird gespeichert');
        setToken(result.data.token);
        console.log('API: Token gespeichert, localStorage:', localStorage.getItem('token')?.substring(0, 20) + '...');
    }

    return result;
};

// Registrierung
export const register = async (
    data: RegisterData
): Promise<{ success: boolean; data?: { id: string; email: string; role: string }; message?: string }> => {
    return await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// ============================================
// NOTIZEN
// ============================================

export interface ChecklistItem {
    text: string;
    isCompleted: boolean;
}

export interface Note {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    priority?: 'low' | 'medium' | 'high' | null;
    reminderDate?: string | null;
    customFields: Record<string, unknown>;
    checklist: ChecklistItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateNoteData {
    title: string;
    content: string;
    tags?: string[];
    priority?: 'low' | 'medium' | 'high' | null;
    reminderDate?: string | null;
    customFields?: Record<string, unknown>;
    checklist?: ChecklistItem[];
}

export interface UpdateNoteData extends Partial<CreateNoteData> {}

// Alle Notizen abrufen (mit Filter)
export const getNotes = async (filters?: {
    tag?: string;
    priority?: string;
    search?: string;
    sort?: 'asc' | 'desc';
}): Promise<{ success: boolean; data?: Note[]; message?: string }> => {
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

// Einzelne Notiz abrufen
export const getNoteById = async (
    id: string
): Promise<{ success: boolean; data?: Note; message?: string }> => {
    return await fetchApi<Note>(`/notes/${id}`);
};

// Neue Notiz erstellen
export const createNote = async (
    data: CreateNoteData
): Promise<{ success: boolean; data?: Note; message?: string }> => {
    return await fetchApi<Note>('/notes', {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// Notiz aktualisieren
export const updateNote = async (
    id: string,
    data: UpdateNoteData
): Promise<{ success: boolean; data?: Note; message?: string }> => {
    return await fetchApi<Note>(`/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
};

// Notiz löschen
export const deleteNote = async (
    id: string
): Promise<{ success: boolean; message?: string }> => {
    return await fetchApi(`/notes/${id}`, {
        method: 'DELETE',
    });
};

// ============================================
// ADMIN-FUNKTIONEN
// ============================================

export interface User {
    _id: string;
    email: string;
    role: string;
    createdAt: string;
}

// Alle Benutzer abrufen (Admin)
export const getAllUsers = async (): Promise<{
    success: boolean;
    data?: User[];
    message?: string;
}> => {
    return await fetchApi<User[]>('/admin/users');
};

// Benutzer löschen (Admin)
export const deleteUser = async (
    id: string
): Promise<{ success: boolean; message?: string }> => {
    return await fetchApi(`/admin/users/${id}`, {
        method: 'DELETE',
    });
};

// Alle Notizen systemweit abrufen (Admin)
export const getAllNotesAdmin = async (): Promise<{
    success: boolean;
    data?: (Note & { user?: User })[];
    message?: string;
}> => {
    return await fetchApi<(Note & { user?: User })[]>('/admin/notes');
};

// ============================================
// HILFSFUNKTIONEN
// ============================================

// Prüfen ob Benutzer eingeloggt ist
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// Aktuellen Benutzer aus dem Token decodieren (ohne Verifizierung)
export const getCurrentUser = (): { id: string; role: string } | null => {
    const token = getToken();
    if (!token) return null;

    try {
        // JWT Payload extrahieren (Base64 decodieren)
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return { id: decoded.id, role: decoded.role };
    } catch {
        return null;
    }
};

// Alle eindeutigen Tags aus den Notizen extrahieren
export const extractUniqueTags = (notes: Note[]): string[] => {
    const tagsSet = new Set<string>();
    notes.forEach((note) => {
        note.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
};
