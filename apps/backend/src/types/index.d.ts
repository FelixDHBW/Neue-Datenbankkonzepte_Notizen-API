// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Request } from 'express';
import type { IUser } from '../models/User.js';

// Erweitert das Express Request-Objekt um den authentifizierten Benutzer (FA-07)
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
