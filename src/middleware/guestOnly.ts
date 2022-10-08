import { Request, Response, NextFunction } from 'express';

export default function guestOnly(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.user) {
        res.cookie('errors', ['User already authenticated.'], {
            httpOnly: true,
        });
        return res.redirect('/admin/chat');
    }
    return next();
}
