// ============================================
// Gemeinsame TypeScript-Typen & Interfaces
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

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateNoteData extends Partial<CreateNoteData> {}

export interface User {
    _id: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export interface ApiResponse<T = undefined> {
    success: boolean;
    data?: T;
    message?: string;
    token?: string;
}
