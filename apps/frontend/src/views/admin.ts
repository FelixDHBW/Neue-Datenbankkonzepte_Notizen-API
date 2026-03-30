// ============================================
// Admin-View: Benutzer, Notizen & Statistiken
// ============================================

import { getAllUsers, deleteUser, banUser, unbanUser, getAllNotesAdmin, getStats } from '../api';
import type { AdminNote } from '../api/admin';
import { showLoading, hideLoading, showToast } from '../utils/ui';
import { escapeHtml, getCurrentUser } from '../utils/helpers';
import type { User } from '../types';

// DOM-Elemente
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

// Admin-Bereich anzeigen
export const showAdminSection = (): void => {
    document.getElementById('dashboard-section')!.style.display = 'none';
    document.getElementById('note-form-section')!.style.display = 'none';
    document.getElementById('note-detail-section')!.style.display = 'none';
    adminSection.style.display = 'block';

    const adminBtn = document.getElementById('btn-admin') as HTMLButtonElement | null;
    if (adminBtn) adminBtn.style.display = 'none';

    showAdminUsersTab();
};

// Admin-Bereich verstecken
export const hideAdminSection = (): void => {
    adminSection.style.display = 'none';
    document.getElementById('dashboard-section')!.style.display = 'block';

    const adminBtn = document.getElementById('btn-admin') as HTMLButtonElement | null;
    if (adminBtn) adminBtn.style.display = 'inline-block';
};

// Tabs
const showAdminUsersTab = (): void => {
    adminUsersTab.style.display = 'block';
    adminNotesTab.style.display = 'none';
    adminStatsTab.style.display = 'none';
    adminNavBtns.forEach((btn) => btn.classList.remove('active'));
    document.querySelector('[data-tab="users"]')?.classList.add('active');
    loadUsers();
};

const showAdminNotesTab = (): void => {
    adminUsersTab.style.display = 'none';
    adminNotesTab.style.display = 'block';
    adminStatsTab.style.display = 'none';
    adminNavBtns.forEach((btn) => btn.classList.remove('active'));
    document.querySelector('[data-tab="notes"]')?.classList.add('active');
    loadAdminNotes();
};

const showAdminStatsTab = (): void => {
    adminUsersTab.style.display = 'none';
    adminNotesTab.style.display = 'none';
    adminStatsTab.style.display = 'block';
    adminNavBtns.forEach((btn) => btn.classList.remove('active'));
    document.querySelector('[data-tab="stats"]')?.classList.add('active');
    loadStats();
};

// Benutzer laden & rendern
const loadUsers = async (): Promise<void> => {
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

const renderUsers = (users: User[]): void => {
    const tbody = usersTable.querySelector('tbody') || usersTable.createTBody();
    tbody.innerHTML = '';

    // Eigene Admin-ID ermitteln, um Selbst-Aktionen im Frontend zu verhindern
    const currentUser = getCurrentUser();

    users.forEach((user) => {
        const row = tbody.insertRow();
        const isSelf = currentUser?.id === user._id;

        const statusBadge = user.isActive
            ? '<span style="color:#22c55e;font-weight:600;">Aktiv</span>'
            : '<span style="color:#ef4444;font-weight:600;">Gesperrt</span>';

        row.innerHTML = `
            <td>${escapeHtml(user.email)}${isSelf ? ' <em style="color:#94a3b8;font-size:0.8em;">(Sie)</em>' : ''}</td>
            <td>${escapeHtml(user.role)}</td>
            <td>${statusBadge}</td>
            <td>${new Date(user.createdAt).toLocaleDateString('de-DE')}</td>
            <td></td>
        `;

        const actionsCell = row.lastElementChild!;

        // Eigenen Account nicht sperren/löschen können (Backend verhindert es ebenfalls)
        if (isSelf) {
            const selfNote = document.createElement('span');
            selfNote.style.color = '#94a3b8';
            selfNote.style.fontSize = '0.85em';
            selfNote.textContent = '–';
            actionsCell.appendChild(selfNote);
            return;
        }

        if (user.isActive) {
            const banBtn = document.createElement('button');
            banBtn.className = 'btn btn-warning btn-sm';
            banBtn.textContent = 'Sperren';
            banBtn.style.marginRight = '4px';
            banBtn.addEventListener('click', () => banUserHandler(user._id));
            actionsCell.appendChild(banBtn);
        } else {
            const unbanBtn = document.createElement('button');
            unbanBtn.className = 'btn btn-success btn-sm';
            unbanBtn.textContent = 'Entsperren';
            unbanBtn.style.marginRight = '4px';
            unbanBtn.addEventListener('click', () => unbanUserHandler(user._id));
            actionsCell.appendChild(unbanBtn);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-sm';
        deleteBtn.textContent = 'Löschen';
        deleteBtn.addEventListener('click', () => deleteUserHandler(user._id));
        actionsCell.appendChild(deleteBtn);
    });
};

// Admin-Notizen laden & rendern
const loadAdminNotes = async (): Promise<void> => {
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

const renderAdminNotes = (notes: AdminNote[]): void => {
    const tbody = notesTable.querySelector('tbody') || notesTable.createTBody();
    tbody.innerHTML = '';

    notes.forEach((note) => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${escapeHtml(note.title)}</td>
            <td>${escapeHtml(note.user?.email || 'Unbekannt')}</td>
            <td>${escapeHtml(note.priority || '')}</td>
            <td>${new Date(note.createdAt).toLocaleDateString('de-DE')}</td>
            <td>${note.tags?.map((tag) => escapeHtml(tag)).join(', ') || ''}</td>
        `;
    });
};

// Statistiken laden – nutzt den dedizierten /api/admin/stats Endpunkt
const loadStats = async (): Promise<void> => {
    try {
        showLoading();
        const [statsResponse, notesResponse] = await Promise.all([
            getStats(),
            getAllNotesAdmin(),
        ]);

        if (statsResponse.success && statsResponse.data && notesResponse.success) {
            const { userCount, noteCount } = statsResponse.data;
            const notes = notesResponse.data || [];

            totalUsersStat.textContent = userCount.toString();
            totalNotesStat.textContent = noteCount.toString();
            avgNotesPerUserStat.textContent =
                userCount > 0 ? (noteCount / userCount).toFixed(1) : '0';

            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            recentActivityStat.textContent = notes
                .filter((n) => new Date(n.updatedAt) >= sevenDaysAgo)
                .length.toString();
        }
    } catch {
        showToast('Fehler beim Laden der Statistiken', 'error');
    } finally {
        hideLoading();
    }
};

// Benutzer-Aktionen
const deleteUserHandler = async (userId: string): Promise<void> => {
    if (!confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?')) return;

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

const banUserHandler = async (userId: string): Promise<void> => {
    if (!confirm('Möchten Sie diesen Benutzer sperren? Er kann sich dann nicht mehr anmelden.'))
        return;

    try {
        showLoading();
        const response = await banUser(userId);
        if (response.success) {
            showToast('Benutzer erfolgreich gesperrt', 'success');
            loadUsers();
        } else {
            showToast(response.message || 'Fehler beim Sperren des Benutzers', 'error');
        }
    } catch {
        showToast('Fehler beim Sperren des Benutzers', 'error');
    } finally {
        hideLoading();
    }
};

const unbanUserHandler = async (userId: string): Promise<void> => {
    if (!confirm('Möchten Sie die Sperre für diesen Benutzer aufheben?')) return;

    try {
        showLoading();
        const response = await unbanUser(userId);
        if (response.success) {
            showToast('Benutzer erfolgreich entsperrt', 'success');
            loadUsers();
        } else {
            showToast(response.message || 'Fehler beim Entsperren des Benutzers', 'error');
        }
    } catch {
        showToast('Fehler beim Entsperren des Benutzers', 'error');
    } finally {
        hideLoading();
    }
};

// Event-Listener für Admin-Navigation
export const initAdminEvents = (): void => {
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

    const btnBackAdmin = document.getElementById('btn-admin-back') as HTMLButtonElement | null;
    if (btnBackAdmin) {
        btnBackAdmin.addEventListener('click', hideAdminSection);
    }

    const adminBtn = document.getElementById('btn-admin') as HTMLButtonElement | null;
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            const user = getCurrentUser();
            if (user?.role === 'Administrator') {
                showAdminSection();
            } else {
                showToast(
                    'Zugriff verweigert: Nur Administratoren können diesen Bereich nutzen',
                    'error'
                );
            }
        });
    }

};
