// ============================================
// Haupt-App-Logik für die Notizen-App
// Steuert alle UI-Interaktionen und API-Calls
// ============================================

import {
    login,
    register,
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    removeToken,
    isAuthenticated,
    getCurrentUser,
    extractUniqueTags,
    getAllUsers,
    deleteUser,
    getAllNotesAdmin,
    Note,
    CreateNoteData,
    User,
} from './api';

// ============================================
// DOM-ELEMENTE
// ============================================

// Auth-Bereich
const authSection = document.getElementById('auth-section') as HTMLElement;
const loginForm = document.getElementById('login-form') as HTMLFormElement;
const registerForm = document.getElementById('register-form') as HTMLFormElement;
const authError = document.getElementById('auth-error') as HTMLElement;
const tabBtns = document.querySelectorAll('.tab-btn');

// Header & Navigation
const header = document.getElementById('header') as HTMLElement;
const userInfo = document.getElementById('user-info') as HTMLElement;
const btnLogout = document.getElementById('btn-logout') as HTMLButtonElement;

// Dashboard
const dashboardSection = document.getElementById('dashboard-section') as HTMLElement;
const notesList = document.getElementById('notes-list') as HTMLElement;
const emptyState = document.getElementById('empty-state') as HTMLElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const filterTag = document.getElementById('filter-tag') as HTMLSelectElement;
const filterPriority = document.getElementById('filter-priority') as HTMLSelectElement;
const sortOrder = document.getElementById('sort-order') as HTMLSelectElement;
const btnNewNote = document.getElementById('btn-new-note') as HTMLButtonElement;

// Notiz-Formular
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
const btnAddCustomField = document.getElementById('btn-add-custom-field') as HTMLButtonElement;
const checklistContainer = document.getElementById('checklist-container') as HTMLElement;
const btnAddChecklistItem = document.getElementById('btn-add-checklist-item') as HTMLButtonElement;
const btnCancel = document.getElementById('btn-cancel') as HTMLButtonElement;

// Notiz-Detail
const noteDetailSection = document.getElementById('note-detail-section') as HTMLElement;
const noteDetailContent = document.getElementById('note-detail-content') as HTMLElement;
const btnBack = document.getElementById('btn-back') as HTMLButtonElement;
const btnEdit = document.getElementById('btn-edit') as HTMLButtonElement;
const btnDelete = document.getElementById('btn-delete') as HTMLButtonElement;

// Admin-Bereich
const adminSection = document.getElementById('admin-section') as HTMLElement;
const adminNavBtns = document.querySelectorAll('.admin-nav-btn');
const adminUsersTab = document.getElementById('admin-users-tab') as HTMLElement;
const adminNotesTab = document.getElementById('admin-notes-tab') as HTMLElement;
const adminStatsTab = document.getElementById('admin-stats-tab') as HTMLElement;
const usersTable = document.getElementById('users-table') as HTMLTableElement;
const notesTable = document.getElementById('notes-table') as HTMLTableElement;
const totalUsersStat = document.getElementById('total-users-stat') as HTMLElement;
const totalNotesStat = document.getElementById('total-notes-stat') as HTMLElement;
const avgNotesPerUserStat = document.getElementById('avg-notes-per-user-stat') as HTMLElement;
const recentActivityStat = document.getElementById('recent-activity-stat') as HTMLElement;

// Loading & Toast
const loadingOverlay = document.getElementById('loading-overlay') as HTMLElement;
const toastContainer = document.getElementById('toast-container') as HTMLElement;

// ============================================
// STATE
// ============================================

let currentNotes: Note[] = [];
let currentNoteId: string | null = null;

// ============================================
// HILFSFUNKTIONEN
// ============================================

// Loading-Overlay anzeigen/verstecken
const showLoading = () => (loadingOverlay.style.display = 'flex');
const hideLoading = () => (loadingOverlay.style.display = 'none');

// Toast-Benachrichtigung anzeigen
const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
};

// Fehlermeldung im Auth-Bereich anzeigen
const showAuthError = (message: string) => {
    authError.textContent = message;
    authError.style.display = 'block';
};

const hideAuthError = () => {
    authError.style.display = 'none';
};

// Datum formatieren
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// ============================================
// AUTHENTIFIZIERUNG
// ============================================

// Tab-Wechsel (Login/Register)
tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');

        // Active-Klasse aktualisieren
        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Formular anzeigen/verstecken
        if (tab === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }

        hideAuthError();
    });
});

// Login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAuthError();

    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;

    showLoading();
    const result = await login({ email, password });
    hideLoading();

    if (result.success) {
        showToast('Erfolgreich angemeldet!', 'success');
        await showDashboard();
    } else {
        showAuthError(result.message || 'Anmeldung fehlgeschlagen');
    }
});

// Registrierung
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAuthError();

    const email = (document.getElementById('register-email') as HTMLInputElement).value;
    const password = (document.getElementById('register-password') as HTMLInputElement).value;

    showLoading();
    const result = await register({ email, password });
    hideLoading();

    if (result.success) {
        showToast('Registrierung erfolgreich! Bitte melde dich an.', 'success');
        // Zur Login-Ansicht wechseln
        (tabBtns[0] as HTMLElement).click();
    } else {
        showAuthError(result.message || 'Registrierung fehlgeschlagen');
    }
});

// Logout
btnLogout.addEventListener('click', () => {
    removeToken();
    showAuthSection();
    showToast('Abgemeldet', 'info');
});

// ============================================
// ANSICHTEN WECHSELN
// ============================================

// Auth-Bereich anzeigen
const showAuthSection = () => {
    authSection.style.display = 'flex';
    header.style.display = 'none';
    dashboardSection.style.display = 'none';
    noteFormSection.style.display = 'none';
    noteDetailSection.style.display = 'none';
    adminSection.style.display = 'none';
};

// Dashboard anzeigen
const showDashboard = async () => {
    authSection.style.display = 'none';
    header.style.display = 'block';
    dashboardSection.style.display = 'block';
    noteFormSection.style.display = 'none';
    noteDetailSection.style.display = 'none';
    adminSection.style.display = 'none';

    // Benutzerinfo aktualisieren
    const user = getCurrentUser();
    const adminBtn = document.getElementById('btn-admin') as HTMLButtonElement | null;

    if (user && user.role === 'Administrator') {
        userInfo.textContent = 'Angemeldet als Admin';
        if (adminBtn) adminBtn.style.display = 'inline-block';
    } else if (user) {
        userInfo.textContent = 'Angemeldet als Benutzer';
        if (adminBtn) adminBtn.style.display = 'none';
    }

    // Notizen laden
    await loadNotes();
};

// Notiz-Formular anzeigen (neu oder bearbeiten)
const showNoteForm = (note?: Note) => {
    authSection.style.display = 'none';
    header.style.display = 'block';
    dashboardSection.style.display = 'none';
    noteFormSection.style.display = 'block';
    noteDetailSection.style.display = 'none';

    // Formular zurücksetzen
    noteForm.reset();
    customFieldsContainer.innerHTML = '';
    checklistContainer.innerHTML = '';

    if (note) {
        // Bearbeiten-Modus
        noteFormTitle.textContent = 'Notiz bearbeiten';
        noteIdInput.value = note._id;
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        notePriorityInput.value = note.priority || '';
        noteReminderInput.value = note.reminderDate
            ? new Date(note.reminderDate).toISOString().slice(0, 16)
            : '';
        noteTagsInput.value = note.tags?.join(', ') || '';

        // Zusatzfelder laden
        if (note.customFields) {
            Object.entries(note.customFields).forEach(([key, value]) => {
                addCustomFieldRow(key, String(value));
            });
        }

        // Checkliste laden
        if (note.checklist) {
            note.checklist.forEach((item) => {
                addChecklistRow(item.text, item.isCompleted);
            });
        }
    } else {
        // Neu-Modus
        noteFormTitle.textContent = 'Neue Notiz erstellen';
        noteIdInput.value = '';
    }
};

// Notiz-Detail anzeigen
const showNoteDetail = async (noteId: string) => {
    showLoading();
    const result = await getNoteById(noteId);
    hideLoading();

    if (!result.success || !result.data) {
        showToast('Notiz konnte nicht geladen werden', 'error');
        return;
    }

    const note = result.data;
    currentNoteId = note._id;

    authSection.style.display = 'none';
    header.style.display = 'block';
    dashboardSection.style.display = 'none';
    noteFormSection.style.display = 'none';
    noteDetailSection.style.display = 'block';

    // Detail-Inhalt aufbauen
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
                ? `
            <div class="note-card-tags" style="margin-bottom: 1.5rem;">
                ${note.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
        `
                : ''
        }

        <div class="note-detail-content">${escapeHtml(note.content)}</div>

        ${
            note.checklist?.length
                ? `
            <div class="checklist">
                <h3>✓ Checkliste</h3>
                ${note.checklist
                    .map(
                        (item) => `
                    <div class="checklist-item ${item.isCompleted ? 'completed' : ''}">
                        <input type="checkbox" ${item.isCompleted ? 'checked' : ''} disabled>
                        <span>${escapeHtml(item.text)}</span>
                    </div>
                `
                    )
                    .join('')}
            </div>
        `
                : ''
        }

        ${
            Object.keys(note.customFields || {}).length
                ? `
            <div class="custom-fields">
                <h3>📎 Zusatzfelder</h3>
                ${Object.entries(note.customFields)
                    .map(
                        ([key, value]) => `
                    <div class="custom-field-item">
                        <span class="custom-field-key">${escapeHtml(key)}:</span>
                        <span class="custom-field-value">${escapeHtml(String(value))}</span>
                    </div>
                `
                    )
                    .join('')}
            </div>
        `
                : ''
        }
    `;
};

// ============================================
// NOTIZEN VERWALTEN
// ============================================

// Notizen laden
const loadNotes = async () => {
    showLoading();

    const filters = {
        tag: filterTag.value,
        priority: filterPriority.value,
        search: searchInput.value,
        sort: sortOrder.value as 'asc' | 'desc',
    };

    const result = await getNotes(filters);
    hideLoading();

    if (result.success && result.data) {
        currentNotes = result.data;
        renderNotes();
        updateTagFilter();
    } else if (result.message?.includes('401') || result.message?.includes('Token')) {
        // Bei Authentifizierungsfehler zum Login zurück
        removeToken();
        showAuthSection();
        showToast('Sitzung abgelaufen. Bitte melde dich erneut an.', 'error');
    } else {
        showToast(result.message || 'Fehler beim Laden der Notizen', 'error');
    }
};

// Notizen rendern
const renderNotes = () => {
    notesList.innerHTML = '';

    if (currentNotes.length === 0) {
        notesList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    notesList.style.display = 'grid';
    emptyState.style.display = 'none';

    currentNotes.forEach((note) => {
        const card = createNoteCard(note);
        notesList.appendChild(card);
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
                    ? `
                <div class="note-card-tags">
                    ${note.tags
                        .slice(0, 3)
                        .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
                        .join('')}
                    ${note.tags.length > 3 ? `<span class="tag">+${note.tags.length - 3}</span>` : ''}
                </div>
            `
                    : '<div></div>'
            }
            <span class="note-card-date">${formatDate(note.updatedAt)}</span>
        </div>
    `;

    card.addEventListener('click', () => showNoteDetail(note._id));

    return card;
};

// Tag-Filter aktualisieren
const updateTagFilter = () => {
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

// ============================================
// FORMULAR-FUNKTIONEN
// ============================================

// Zusatzfeld hinzufügen
const addCustomFieldRow = (key: string = '', value: string = '') => {
    const row = document.createElement('div');
    row.className = 'custom-field-row';
    row.innerHTML = `
        <input type="text" placeholder="Schlüssel" class="custom-key" value="${escapeHtml(key)}">
        <input type="text" placeholder="Wert" class="custom-value" value="${escapeHtml(value)}">
        <button type="button" class="btn-remove">Entfernen</button>
    `;

    row.querySelector('.btn-remove')?.addEventListener('click', () => row.remove());
    customFieldsContainer.appendChild(row);
};

// Checklisten-Eintrag hinzufügen
const addChecklistRow = (text: string = '', isCompleted: boolean = false) => {
    const row = document.createElement('div');
    row.className = 'checklist-item-row';
    row.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''} class="checklist-check">
        <input type="text" placeholder="Aufgabe..." class="checklist-text" value="${escapeHtml(text)}">
        <button type="button" class="btn-remove">Entfernen</button>
    `;

    row.querySelector('.btn-remove')?.addEventListener('click', () => row.remove());
    checklistContainer.appendChild(row);
};

// Notiz speichern
noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Tags parsen
    const tags = noteTagsInput.value
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

    // Zusatzfelder sammeln
    const customFields: Record<string, string> = {};
    customFieldsContainer.querySelectorAll('.custom-field-row').forEach((row) => {
        const key = (row.querySelector('.custom-key') as HTMLInputElement)?.value.trim();
        const value = (row.querySelector('.custom-value') as HTMLInputElement)?.value.trim();
        if (key) {
            customFields[key] = value;
        }
    });

    // Checkliste sammeln
    const checklist: { text: string; isCompleted: boolean }[] = [];
    checklistContainer.querySelectorAll('.checklist-item-row').forEach((row) => {
        const text = (row.querySelector('.checklist-text') as HTMLInputElement)?.value.trim();
        const isCompleted = (row.querySelector('.checklist-check') as HTMLInputElement)?.checked;
        if (text) {
            checklist.push({ text, isCompleted });
        }
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
    let result;

    if (noteId) {
        // Aktualisieren
        result = await updateNote(noteId, noteData);
    } else {
        // Neu erstellen
        result = await createNote(noteData);
    }

    hideLoading();

    if (result.success) {
        showToast(noteId ? 'Notiz aktualisiert!' : 'Notiz erstellt!', 'success');
        showDashboard();
    } else {
        showToast(result.message || 'Fehler beim Speichern', 'error');
    }
});

// ============================================
// EVENT-LISTENER
// ============================================

// Neue Notiz Button
btnNewNote.addEventListener('click', () => showNoteForm());

// Formular abbrechen
btnCancel.addEventListener('click', () => showDashboard());

// Filter ändern
searchInput.addEventListener('input', debounce(loadNotes, 300));
filterTag.addEventListener('change', loadNotes);
filterPriority.addEventListener('change', loadNotes);
sortOrder.addEventListener('change', loadNotes);

// Zusatzfeld hinzufügen
btnAddCustomField.addEventListener('click', () => addCustomFieldRow());

// Checklisten-Eintrag hinzufügen
btnAddChecklistItem.addEventListener('click', () => addChecklistRow());

// Zurück Button
btnBack.addEventListener('click', () => showDashboard());

// Bearbeiten Button
btnEdit.addEventListener('click', async () => {
    if (!currentNoteId) return;

    showLoading();
    const result = await getNoteById(currentNoteId);
    hideLoading();

    if (result.success && result.data) {
        showNoteForm(result.data);
    } else {
        showToast('Notiz konnte nicht geladen werden', 'error');
    }
});

// Löschen Button
btnDelete.addEventListener('click', async () => {
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

// ============================================
// UTILITIES
// ============================================

// HTML escapen (XSS-Schutz)
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Debounce-Funktion für Suche
function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// ============================================
// ADMIN-FUNKTIONALITÄT
// ============================================

// Admin-Bereich anzeigen/verstecken
const showAdminSection = () => {
    dashboardSection.style.display = 'none';
    noteFormSection.style.display = 'none';
    noteDetailSection.style.display = 'none';
    adminSection.style.display = 'block';
    // Admin-Button im Header ausblenden, damit er nicht als zweiter "Zurück"-Button wirkt
    const adminBtn = document.getElementById('btn-admin') as HTMLButtonElement | null;
    if (adminBtn) adminBtn.style.display = 'none';
    // Alle dynamisch erstellten alten Zurück-Buttons entfernen (Schutz gegen gecachten alten Code)
    adminSection.querySelectorAll('.btn-back-admin').forEach((el) => el.remove());
    showAdminUsersTab();
};

const hideAdminSection = () => {
    adminSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    // Admin-Button im Header wieder einblenden
    const adminBtn = document.getElementById('btn-admin') as HTMLButtonElement | null;
    if (adminBtn) adminBtn.style.display = 'inline-block';
};

// Admin-Tabs wechseln
const showAdminUsersTab = () => {
    adminUsersTab.style.display = 'block';
    adminNotesTab.style.display = 'none';
    adminStatsTab.style.display = 'none';
    adminNavBtns.forEach((btn) => btn.classList.remove('active'));
    document.querySelector('[data-tab="users"]')?.classList.add('active');
    loadUsers();
};

const showAdminNotesTab = () => {
    adminUsersTab.style.display = 'none';
    adminNotesTab.style.display = 'block';
    adminStatsTab.style.display = 'none';
    adminNavBtns.forEach((btn) => btn.classList.remove('active'));
    document.querySelector('[data-tab="notes"]')?.classList.add('active');
    loadAdminNotes();
};

const showAdminStatsTab = () => {
    adminUsersTab.style.display = 'none';
    adminNotesTab.style.display = 'none';
    adminStatsTab.style.display = 'block';
    adminNavBtns.forEach((btn) => btn.classList.remove('active'));
    document.querySelector('[data-tab="stats"]')?.classList.add('active');
    loadStats();
};

// Benutzer laden und anzeigen
const loadUsers = async () => {
    try {
        showLoading();
        const response = await getAllUsers();
        if (response.success && response.data) {
            renderUsers(response.data);
        } else {
            showToast('Fehler beim Laden der Benutzer', 'error');
        }
    } catch {
        showToast('Fehler beim Laden der Benutzer', 'error');
    } finally {
        hideLoading();
    }
};

const renderUsers = (users: User[]) => {
    const tbody = usersTable.querySelector('tbody') || usersTable.createTBody();
    tbody.innerHTML = '';

    users.forEach((user) => {
        const row = tbody.insertRow();
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.textContent = 'Löschen';
        deleteBtn.addEventListener('click', () => deleteUserHandler(user._id));

        row.innerHTML = `
            <td>${escapeHtml(user.email)}</td>
            <td>${escapeHtml(user.role)}</td>
            <td>${new Date(user.createdAt).toLocaleDateString('de-DE')}</td>
            <td></td>
        `;
        // Löschen-Button sicher per Event-Listener einfügen (kein onclick-String)
        row.lastElementChild?.appendChild(deleteBtn);
    });
};

// Admin-Notizen laden
const loadAdminNotes = async () => {
    try {
        showLoading();
        const response = await getAllNotesAdmin();
        if (response.success && response.data) {
            renderAdminNotes(response.data);
        } else {
            showToast('Fehler beim Laden der Notizen', 'error');
        }
    } catch {
        showToast('Fehler beim Laden der Notizen', 'error');
    } finally {
        hideLoading();
    }
};

const renderAdminNotes = (notes: (Note & { user?: User })[]) => {
    const tbody = notesTable.querySelector('tbody') || notesTable.createTBody();
    tbody.innerHTML = '';

    notes.forEach((note) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${escapeHtml(note.title)}</td>
            <td>${escapeHtml(note.user?.email || 'Unbekannt')}</td>
            <td>${escapeHtml(note.priority || '')}</td>
            <td>${new Date(note.createdAt).toLocaleDateString('de-DE')}</td>
            <td>${note.tags?.join(', ') || ''}</td>
        `;
    });
};

// Statistiken laden
const loadStats = async () => {
    try {
        showLoading();
        const usersResponse = await getAllUsers();
        const notesResponse = await getAllNotesAdmin();

        if (usersResponse.success && notesResponse.success) {
            const users = usersResponse.data || [];
            const notes = notesResponse.data || [];

            totalUsersStat.textContent = users.length.toString();
            totalNotesStat.textContent = notes.length.toString();

            const avgNotes = users.length > 0 ? (notes.length / users.length).toFixed(1) : '0';
            avgNotesPerUserStat.textContent = avgNotes;

            // Anzahl der Notizen, die in den letzten 7 Tagen bearbeitet wurden
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            const recentCount = notes.filter(
                (n) => new Date(n.updatedAt) >= sevenDaysAgo
            ).length;
            recentActivityStat.textContent = recentCount.toString();
        }
    } catch {
        showToast('Fehler beim Laden der Statistiken', 'error');
    } finally {
        hideLoading();
    }
};

// Benutzer löschen
const deleteUserHandler = async (userId: string) => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?')) {
        return;
    }

    try {
        showLoading();
        const response = await deleteUser(userId);
        if (response.success) {
            showToast('Benutzer erfolgreich gelöscht', 'success');
            loadUsers();
        } else {
            showToast(response.message || 'Fehler beim Löschen des Benutzers', 'error');
        }
    } catch {
        showToast('Fehler beim Löschen des Benutzers', 'error');
    } finally {
        hideLoading();
    }
};

// Admin-Navigation Event-Listener
adminNavBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        switch (tab) {
            case 'users':
                showAdminUsersTab();
                break;
            case 'notes':
                showAdminNotesTab();
                break;
            case 'stats':
                showAdminStatsTab();
                break;
        }
    });
});

// Admin-Button Event-Listener
const setupAdminButton = () => {
    const adminBtn = document.getElementById('btn-admin') as HTMLButtonElement | null;
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            const user = getCurrentUser();
            if (user && user.role === 'Administrator') {
                showAdminSection();
            } else {
                showToast('Zugriff verweigert: Nur Administratoren können diesen Bereich nutzen', 'error');
            }
        });
    }
};
setupAdminButton();

// Alle dynamisch erstellten alten Zurück-Buttons entfernen (Bereinigung alter gecachter Versionen)
const oldBtns = document.querySelectorAll('.btn-back-admin');
if (oldBtns.length > 0) {
    console.warn(`[Cleanup] ${oldBtns.length} alter Zurück-Button(s) gefunden und entfernt.`);
    oldBtns.forEach((el) => el.remove());
}

// Zurück-Button für Admin-Bereich (statisch im HTML definiert)
const btnBackAdmin = document.getElementById('btn-admin-back') as HTMLButtonElement | null;
if (btnBackAdmin) {
    btnBackAdmin.addEventListener('click', hideAdminSection);
}

// ============================================
// APP STARTEN
// ============================================

// Beim Laden prüfen ob eingeloggt
if (isAuthenticated()) {
    showDashboard();
} else {
    showAuthSection();
}
