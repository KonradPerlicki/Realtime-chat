import { NextFunction, Request, Response } from 'express';
import { createToken, verifyToken } from '../utils/jwt';

function deserializeUser(req: Request, res: Response, next: NextFunction) {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken) {
        return next();
    }

    const { user, expired } = verifyToken(accessToken, 'access');

    // For a valid access token
    if (user) {
        req.user = user;
        res.locals.user = user;
        return next();
    }

    // expired but valid access token

    const { user: refreshUser } =
        expired && refreshToken
            ? verifyToken(refreshToken, 'refresh')
            : { user: null };

    if (!refreshUser) {
        return next();
    }

    const newAccessToken = createToken(refreshUser, 'access');

    res.cookie('accessToken', newAccessToken, {
        maxAge: 1000 * 60 * 15, // 15 minutes
        httpOnly: true,
    });

    req.user = refreshUser;
    res.locals.user = refreshUser;
    return next();
}

export default deserializeUser;
