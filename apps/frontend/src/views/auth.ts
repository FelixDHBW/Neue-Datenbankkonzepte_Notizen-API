// ============================================
// Auth-View: Login & Registrierung
// ============================================

import { login, register, removeToken } from '../api';
import { showLoading, hideLoading, showToast, showAuthError, hideAuthError } from '../utils/ui';

// DOM-Elemente
const authSection = document.getElementById('auth-section') as HTMLElement;
const loginForm = document.getElementById('login-form') as HTMLFormElement;
const registerForm = document.getElementById('register-form') as HTMLFormElement;
const tabBtns = document.querySelectorAll('.tab-btn');

// Auth-Bereich anzeigen
export const showAuthSection = (): void => {
    authSection.style.display = 'flex';
    document.getElementById('header')!.style.display = 'none';
    document.getElementById('dashboard-section')!.style.display = 'none';
    document.getElementById('note-form-section')!.style.display = 'none';
    document.getElementById('note-detail-section')!.style.display = 'none';
    document.getElementById('admin-section')!.style.display = 'none';
};

// Tab-Wechsel (Login / Registrierung)
tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');

        tabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

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

// Login-Formular
export const initAuthEvents = (onLoginSuccess: () => Promise<void>): void => {
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
            await onLoginSuccess();
        } else {
            showAuthError(result.message || 'Anmeldung fehlgeschlagen');
        }
    });

    // Registrierungs-Formular
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
            (tabBtns[0] as HTMLElement).click();
        } else {
            showAuthError(result.message || 'Registrierung fehlgeschlagen');
        }
    });

    // Logout
    document.getElementById('btn-logout')!.addEventListener('click', () => {
        removeToken();
        showAuthSection();
        showToast('Abgemeldet', 'info');
    });
};
