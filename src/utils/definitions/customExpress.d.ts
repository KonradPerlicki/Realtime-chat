import { UserInterface } from '../../models/User';

declare global {
    namespace Express {
        export interface CustomSession {
            messages?: string[];
        }
        interface Request {
            user: UserInterface | null;
        }
    }
}
