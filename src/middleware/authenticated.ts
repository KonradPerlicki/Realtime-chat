import { Request, Response, NextFunction } from 'express';
import StatusCodes from 'http-status-codes';

export default function authenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.user) {
        res.cookie('errors', ['Unauthorized action.'], { httpOnly: true });
        return res.status(StatusCodes.UNAUTHORIZED).redirect('/admin/login');
    }
    return next();
}
