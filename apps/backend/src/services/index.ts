/**
 * Services-Modul
 *
 * Dieses Modul exportiert alle Service-Klassen und -Instanzen,
 * die die Geschäftslogik der Anwendung kapseln.
 *
 * Die Services folgen dem Single Responsibility Principle und
 * trennen die Geschäftslogik von den Controllern.
 */

// Note Service
export { NoteService, noteService } from './noteService.js';
export type { INoteFilterOptions, ICreateNoteData, IUpdateNoteData } from './noteService.js';

// Auth Service
export { AuthService, authService } from './authService.js';
export type { IAuthData, IRegisterResult, ILoginResult } from './authService.js';

// Admin Service
export { AdminService, adminService } from './adminService.js';
export type { IUserInfo, INoteWithUserInfo, IDeleteUserResult } from './adminService.js';
