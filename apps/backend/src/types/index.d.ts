import { Request } from 'express';
import { IUser } from '../models/User';

// Erweitert das Express Request-Objekt um den authentifizierten Benutzer (FA-07)
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
