import { Response } from 'express';
import { UserInterface } from '../models/User';
import { createToken } from '../utils/jwt';

export default class MainService {
    public registerTokens = (res: Response, user: UserInterface) => {
        const accessToken = createToken(user, 'access');
        const refreshToken = createToken(user, 'refresh');
        res.cookie('accessToken', accessToken, {
            maxAge: 1000 * 60 * 10, // 10 minutes
            httpOnly: true,
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
            httpOnly: true,
        });
    };
}
