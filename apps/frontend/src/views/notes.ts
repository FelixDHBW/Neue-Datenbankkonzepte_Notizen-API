// ============================================
// Notes-View: Dashboard & Notiz-Detail
// ============================================

import { getNotes, getNoteById, deleteNote } from '../api';
import { showLoading, hideLoading, showToast } from '../utils/ui';
import { formatDate, escapeHtml, extractUniqueTags, getCurrentUser, debounce } from '../utils/helpers';
import { showAuthSection } from './auth';
import type { Note } from '../types';

// DOM-Elemente
const dashboardSection = document.getElementById('dashboard-section') as HTMLElement;
const notesList = document.getElementById('notes-list') as HTMLElement;
const emptyState = document.getElementById('empty-state') as HTMLElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const filterTag = document.getElementById('filter-tag') as HTMLSelectElement;
const filterPriority = document.getElementById('filter-priority') as HTMLSelectElement;
const sortOrder = document.getElementById('sort-order') as HTMLSelectElement;
const noteDetailSection = document.getElementById('note-detail-section') as HTMLElement;
const noteDetailContent = document.getElementById('note-detail-content') as HTMLElement;

let currentNotes: Note[] = [];
export let currentNoteId: string | null = null;

// Dashboard anzeigen
export const showDashboard = async (): Promise<void> => {
    document.getElementById('auth-section')!.style.display = 'none';
    document.getElementById('header')!.style.display = 'block';
    dashboardSection.style.display = 'block';
    document.getElementById('note-form-section')!.style.display = 'none';
    noteDetailSection.style.display = 'none';
    document.getElementById('admin-section')!.style.display = 'none';

    const user = getCurrentUser();
    const adminBtn = document.getElementById('btn-admin') as HTMLButtonElement | null;
    const userInfo = document.getElementById('user-info') as HTMLElement;

    if (user?.role === 'Administrator') {
        userInfo.textContent = 'Angemeldet als Admin';
        if (adminBtn) adminBtn.style.display = 'inline-block';
    } else if (user) {
        userInfo.textContent = 'Angemeldet als Benutzer';
        if (adminBtn) adminBtn.style.display = 'none';
    }

    await loadNotes();
};

// Notizen laden
export const loadNotes = async (): Promise<void> => {
    showLoading();

    // Leere Strings nicht als Filter übergeben – Backend würde sonst nach "" filtern
    const filters: { tag?: string; priority?: string; search?: string; sort?: 'asc' | 'desc' } = {
        sort: sortOrder.value as 'asc' | 'desc',
    };
    if (filterTag.value) filters.tag = filterTag.value;
    if (filterPriority.value) filters.priority = filterPriority.value;
    if (searchInput.value) filters.search = searchInput.value;

    const result = await getNotes(filters);
    hideLoading();

    if (result.success && result.data) {
        currentNotes = result.data;
        renderNotes();
        updateTagFilter();
    } else if (result.unauthorized) {
        // Token abgelaufen oder ungültig – fetchApi hat Token bereits entfernt
        showAuthSection();
        showToast('Sitzung abgelaufen. Bitte melde dich erneut an.', 'error');
    } else {
        showToast(result.message || 'Fehler beim Laden der Notizen', 'error');
    }
};

// Notizen rendern
const renderNotes = (): void => {
    notesList.innerHTML = '';

    if (currentNotes.length === 0) {
        notesList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    notesList.style.display = 'grid';
    emptyState.style.display = 'none';

    currentNotes.forEach((note) => {
        notesList.appendChild(createNoteCard(note));
    });
};

// Notiz-Karte erstellen
const createNoteCard = (note: Note): HTMLElement => {
    const card = document.createElement('div');
    card.className = 'note-card';

    const priorityClass = note.priority ? `priority-${note.priority}` : '';
    const priorityText = note.priority
        ? { low: 'Niedrig', medium: 'Mittel', high: 'Hoch' }[note.priority]
        : '';

    card.innerHTML = `
        <div class="note-card-header">
            <h3 class="note-card-title">${escapeHtml(note.title)}</h3>
            ${note.priority ? `<span class="note-card-priority ${priorityClass}">${priorityText}</span>` : ''}
        </div>
        <div class="note-card-content">${escapeHtml(note.content)}</div>
        <div class="note-card-footer">
            ${
                note.tags?.length
                    ? `<div class="note-card-tags">
                        ${note.tags
                            .slice(0, 3)
                            .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
                            .join('')}
                        ${note.tags.length > 3 ? `<span class="tag">+${note.tags.length - 3}</span>` : ''}
                    </div>`
                    : '<div></div>'
            }
            <span class="note-card-date">${formatDate(note.updatedAt)}</span>
        </div>
    `;

    card.addEventListener('click', () => showNoteDetail(note._id));
    return card;
};

// Tag-Filter aktualisieren
const updateTagFilter = (): void => {
    const currentValue = filterTag.value;
    const tags = extractUniqueTags(currentNotes);

    filterTag.innerHTML = '<option value="">Alle Tags</option>';
    tags.forEach((tag) => {
        const option = document.createElement('option');
        option.value = tag;
        option.textContent = tag;
        filterTag.appendChild(option);
    });

    filterTag.value = currentValue;
};

// Notiz-Detail anzeigen
export const showNoteDetail = async (noteId: string): Promise<void> => {
    showLoading();
    const result = await getNoteById(noteId);
    hideLoading();

    if (!result.success || !result.data) {
        showToast('Notiz konnte nicht geladen werden', 'error');
        return;
    }

    const note = result.data;
    currentNoteId = note._id;

    document.getElementById('auth-section')!.style.display = 'none';
    document.getElementById('header')!.style.display = 'block';
    dashboardSection.style.display = 'none';
    document.getElementById('note-form-section')!.style.display = 'none';
    noteDetailSection.style.display = 'block';

    const priorityClass = note.priority ? `priority-${note.priority}` : '';
    const priorityText = note.priority
        ? { low: 'Niedrig', medium: 'Mittel', high: 'Hoch' }[note.priority]
        : '';

    noteDetailContent.innerHTML = `
        <h1 class="note-detail-title">${escapeHtml(note.title)}</h1>

        <div class="note-detail-meta">
            ${note.priority ? `<span class="note-card-priority ${priorityClass}">${priorityText}</span>` : ''}
            <span class="meta-item">📅 Erstellt: ${formatDate(note.createdAt)}</span>
            <span class="meta-item">📝 Bearbeitet: ${formatDate(note.updatedAt)}</span>
            ${note.reminderDate ? `<span class="meta-item">⏰ Erinnerung: ${formatDate(note.reminderDate)}</span>` : ''}
        </div>

        ${
            note.tags?.length
                ? `<div class="note-card-tags" style="margin-bottom: 1.5rem;">
                    ${note.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                </div>`
                : ''
        }

        <div class="note-detail-content">${escapeHtml(note.content)}</div>

        ${
            note.checklist?.length
                ? `<div class="checklist">
                    <h3>✓ Checkliste</h3>
                    ${note.checklist
                        .map(
                            (item) => `
                        <div class="checklist-item ${item.isCompleted ? 'completed' : ''}">
                            <input type="checkbox" ${item.isCompleted ? 'checked' : ''} disabled>
                            <span>${escapeHtml(item.text)}</span>
                        </div>`
                        )
                        .join('')}
                </div>`
                : ''
        }

        ${
            Object.keys(note.customFields || {}).length
                ? `<div class="custom-fields">
                    <h3>📎 Zusatzfelder</h3>
                    ${Object.entries(note.customFields)
                        .map(
                            ([key, value]) => `
                        <div class="custom-field-item">
                            <span class="custom-field-key">${escapeHtml(key)}:</span>
                            <span class="custom-field-value">${escapeHtml(typeof value === 'object' ? JSON.stringify(value) : String(value))}</span>
                        </div>`
                        )
                        .join('')}
                </div>`
                : ''
        }
    `;
};

// Event-Listener für Dashboard-Filter & Buttons
export const initNotesEvents = (onNewNote: () => void, onEditNote: () => Promise<void>): void => {
    document.getElementById('btn-new-note')!.addEventListener('click', onNewNote);
    document.getElementById('btn-back')!.addEventListener('click', () => showDashboard());
    document.getElementById('btn-edit')!.addEventListener('click', onEditNote);

    document.getElementById('btn-delete')!.addEventListener('click', async () => {
        if (!currentNoteId) return;
        if (!confirm('Möchtest du diese Notiz wirklich löschen?')) return;

        showLoading();
        const result = await deleteNote(currentNoteId);
        hideLoading();

        if (result.success) {
            showToast('Notiz gelöscht!', 'success');
            showDashboard();
        } else {
            showToast(result.message || 'Fehler beim Löschen', 'error');
        }
    });

    searchInput.addEventListener('input', debounce(loadNotes, 300));
    filterTag.addEventListener('change', loadNotes);
    filterPriority.addEventListener('change', loadNotes);
    sortOrder.addEventListener('change', loadNotes);
};
