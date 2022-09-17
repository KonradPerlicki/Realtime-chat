import { User } from '../../models/User';

declare global {
    namespace Express {
        export interface CustomSession {
            messages?: string[];
        }
        interface Request {
            user: User | null;
        }
    }
}
