// ============================================
// UI-Hilfsfunktionen: Loading, Toast, Fehler
// ============================================

const loadingOverlay = document.getElementById('loading-overlay') as HTMLElement;
const toastContainer = document.getElementById('toast-container') as HTMLElement;
const authError = document.getElementById('auth-error') as HTMLElement;

export const showLoading = (): void => {
    loadingOverlay.style.display = 'flex';
};

export const hideLoading = (): void => {
    loadingOverlay.style.display = 'none';
};

export const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
): void => {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
};

export const showAuthError = (message: string): void => {
    authError.textContent = message;
    authError.style.display = 'block';
};

export const hideAuthError = (): void => {
    authError.style.display = 'none';
};
