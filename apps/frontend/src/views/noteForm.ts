// ============================================
// NoteForm-View: Notiz erstellen & bearbeiten
// ============================================

import { createNote, updateNote, getNoteById } from '../api';
import { showLoading, hideLoading, showToast } from '../utils/ui';
import { escapeHtml } from '../utils/helpers';
import { showDashboard, currentNoteId } from './notes';
import type { Note, CreateNoteData } from '../types';

// DOM-Elemente
const noteFormSection = document.getElementById('note-form-section') as HTMLElement;
const noteForm = document.getElementById('note-form') as HTMLFormElement;
const noteFormTitle = document.getElementById('note-form-title') as HTMLElement;
const noteIdInput = document.getElementById('note-id') as HTMLInputElement;
const noteTitleInput = document.getElementById('note-title') as HTMLInputElement;
const noteContentInput = document.getElementById('note-content') as HTMLTextAreaElement;
const notePriorityInput = document.getElementById('note-priority') as HTMLSelectElement;
const noteReminderInput = document.getElementById('note-reminder') as HTMLInputElement;
const noteTagsInput = document.getElementById('note-tags') as HTMLInputElement;
const customFieldsContainer = document.getElementById('custom-fields-container') as HTMLElement;
const checklistContainer = document.getElementById('checklist-container') as HTMLElement;

// Zusatzfeld-Zeile hinzufügen
const addCustomFieldRow = (key = '', value = ''): void => {
    const row = document.createElement('div');
    row.className = 'custom-field-row';

    const keyInput = document.createElement('input');
    keyInput.type = 'text';
    keyInput.placeholder = 'Schlüssel';
    keyInput.className = 'custom-key';
    keyInput.value = key;

    const valueInput = document.createElement('input');
    valueInput.type = 'text';
    valueInput.placeholder = 'Wert';
    valueInput.className = 'custom-value';
    valueInput.value = value;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove';
    removeBtn.textContent = 'Entfernen';
    removeBtn.addEventListener('click', () => row.remove());

    row.appendChild(keyInput);
    row.appendChild(valueInput);
    row.appendChild(removeBtn);
    customFieldsContainer.appendChild(row);
};

// Checklisten-Zeile hinzufügen
const addChecklistRow = (text = '', isCompleted = false): void => {
    const row = document.createElement('div');
    row.className = 'checklist-item-row';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checklist-check';
    checkbox.checked = isCompleted;

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Aufgabe...';
    textInput.className = 'checklist-text';
    textInput.value = text;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn-remove';
    removeBtn.textContent = 'Entfernen';
    removeBtn.addEventListener('click', () => row.remove());

    row.appendChild(checkbox);
    row.appendChild(textInput);
    row.appendChild(removeBtn);
    checklistContainer.appendChild(row);
};

// Notiz-Formular anzeigen (neu oder bearbeiten)
export const showNoteForm = (note?: Note): void => {
    document.getElementById('auth-section')!.style.display = 'none';
    document.getElementById('header')!.style.display = 'block';
    document.getElementById('dashboard-section')!.style.display = 'none';
    noteFormSection.style.display = 'block';
    document.getElementById('note-detail-section')!.style.display = 'none';

    noteForm.reset();
    customFieldsContainer.innerHTML = '';
    checklistContainer.innerHTML = '';

    if (note) {
        noteFormTitle.textContent = 'Notiz bearbeiten';
        noteIdInput.value = note._id;
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        notePriorityInput.value = note.priority || '';
        noteReminderInput.value = note.reminderDate
            ? new Date(note.reminderDate).toISOString().slice(0, 16)
            : '';
        noteTagsInput.value = note.tags?.join(', ') || '';

        if (note.customFields) {
            Object.entries(note.customFields).forEach(([key, value]) => {
                addCustomFieldRow(key, String(value));
            });
        }

        if (note.checklist) {
            note.checklist.forEach((item) => addChecklistRow(item.text, item.isCompleted));
        }
    } else {
        noteFormTitle.textContent = 'Neue Notiz erstellen';
        noteIdInput.value = '';
    }
};

// Event-Listener für das Notiz-Formular
export const initNoteFormEvents = (): void => {
    // Zusatzfeld hinzufügen
    document.getElementById('btn-add-custom-field')!.addEventListener('click', () =>
        addCustomFieldRow()
    );

    // Checklisten-Eintrag hinzufügen
    document.getElementById('btn-add-checklist-item')!.addEventListener('click', () =>
        addChecklistRow()
    );

    // Abbrechen
    document.getElementById('btn-cancel')!.addEventListener('click', () => showDashboard());

    // Formular speichern
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const tags = noteTagsInput.value
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t.length > 0);

        const customFields: Record<string, string> = {};
        customFieldsContainer.querySelectorAll('.custom-field-row').forEach((row) => {
            const key = (row.querySelector('.custom-key') as HTMLInputElement)?.value.trim();
            const value = (row.querySelector('.custom-value') as HTMLInputElement)?.value.trim();
            if (key) customFields[key] = value;
        });

        const checklist: { text: string; isCompleted: boolean }[] = [];
        checklistContainer.querySelectorAll('.checklist-item-row').forEach((row) => {
            const text = (row.querySelector('.checklist-text') as HTMLInputElement)?.value.trim();
            const isCompleted = (row.querySelector('.checklist-check') as HTMLInputElement)?.checked;
            if (text) checklist.push({ text, isCompleted });
        });

        const noteData: CreateNoteData = {
            title: noteTitleInput.value.trim(),
            content: noteContentInput.value.trim(),
            tags,
            priority: (notePriorityInput.value as 'low' | 'medium' | 'high') || null,
            reminderDate: noteReminderInput.value || null,
            customFields,
            checklist,
        };

        showLoading();
        const noteId = noteIdInput.value;
        const result = noteId
            ? await updateNote(noteId, noteData)
            : await createNote(noteData);
        hideLoading();

        if (result.success) {
            showToast(noteId ? 'Notiz aktualisiert!' : 'Notiz erstellt!', 'success');
            showDashboard();
        } else {
            showToast(result.message || 'Fehler beim Speichern', 'error');
        }
    });
};

// Bearbeiten-Button: aktuelle Notiz laden und Formular öffnen
export const handleEditNote = async (): Promise<void> => {
    if (!currentNoteId) return;

    showLoading();
    const result = await getNoteById(currentNoteId);
    hideLoading();

    if (result.success && result.data) {
        showNoteForm(result.data);
    } else {
        showToast('Notiz konnte nicht geladen werden', 'error');
    }
};
