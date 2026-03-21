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
export { NoteService, noteService } from './noteService';
export type { INoteFilterOptions, ICreateNoteData, IUpdateNoteData } from './noteService';

// Auth Service
export { AuthService, authService } from './authService';
export type { IRegisterData, ILoginData, IRegisterResult, ILoginResult } from './authService';

// Admin Service
export { AdminService, adminService } from './adminService';
export type { IUserInfo, INoteWithUserInfo, IDeleteUserResult } from './adminService';
