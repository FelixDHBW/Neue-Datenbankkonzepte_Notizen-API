// ============================================
// App-Einstiegspunkt
// Initialisiert alle Views & Event-Listener
// ============================================

import { isAuthenticated } from './utils/helpers';
import { showDashboard, initNotesEvents } from './views/notes';
import { showNoteForm, initNoteFormEvents, handleEditNote } from './views/noteForm';
import { showAuthSection, initAuthEvents } from './views/auth';
import { initAdminEvents } from './views/admin';

// Notiz-Formular Events registrieren
initNoteFormEvents();

// Admin Events registrieren
initAdminEvents();

// Notes Events registrieren
initNotesEvents(
    () => showNoteForm(),
    () => handleEditNote()
);

// Auth Events registrieren (mit Callback nach erfolgreichem Login)
initAuthEvents(() => showDashboard());

// App-Titel führt zurück zum Dashboard
const btnHome = document.getElementById('btn-home') as HTMLElement | null;
if (btnHome) {
    btnHome.addEventListener('click', () => showDashboard());
}

// App starten: eingeloggt → Dashboard, sonst → Auth
if (isAuthenticated()) {
    showDashboard();
} else {
    showAuthSection();
}
