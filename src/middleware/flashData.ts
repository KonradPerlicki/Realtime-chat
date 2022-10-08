import { Request, Response, NextFunction } from 'express';

export default function flashData(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { errors, success } = req.cookies;
    res.clearCookie('errors');
    res.clearCookie('success');
    res.locals.errors = errors ?? [];
    res.locals.success = success ?? [];

    return next();
}
