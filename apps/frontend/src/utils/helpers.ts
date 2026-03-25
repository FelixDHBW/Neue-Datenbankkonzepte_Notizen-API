// ============================================
// Allgemeine Hilfsfunktionen
// ============================================

import type { Note } from '../types';

// HTML escapen (XSS-Schutz)
export function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Datum formatieren (de-DE)
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

// Debounce-Funktion für Suche
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Alle eindeutigen Tags aus Notizen extrahieren
export function extractUniqueTags(notes: Note[]): string[] {
    const tagsSet = new Set<string>();
    notes.forEach((note) => {
        note.tags?.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
}

// Aktuellen Benutzer aus JWT-Token decodieren (ohne Verifizierung)
export function getCurrentUser(): { id: string; role: string } | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const payload = token.split('.')[1];
        const decoded = JSON.parse(atob(payload));
        return { id: decoded.id, role: decoded.role };
    } catch {
        return null;
    }
}

// Prüfen ob Benutzer eingeloggt ist
export function isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
}
