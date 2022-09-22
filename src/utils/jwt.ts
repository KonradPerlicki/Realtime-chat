import { UserInterface } from '../models/User';
import jwt from 'jsonwebtoken';
import config from 'config';

const formatUserData = (user: UserInterface) => {
    return {
        id: user._id.toString() as string,
        username: user.username,
        email: user.email,
        photo: user.photo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

type Tokens = 'access' | 'refresh';
export const createToken = (user: UserInterface, type: Tokens) => {
    const payload = formatUserData(user);
    const secret = config.get<string>(type + '_token_secret');
    const expire = config.get<string>(type + '_token_expire');
    return jwt.sign(payload, secret as jwt.Secret, {
        expiresIn: expire,
    });
};

export const verifyToken = (
    token: string,
    type: Tokens
): {
    user: UserInterface | null;
    expired: boolean;
} => {
    try {
        const secret = config.get<string>(type + '_token_secret');
        const decoded = jwt.verify(token, secret);
        return { user: decoded as UserInterface, expired: false };
    } catch (error) {
        return { user: null, expired: true };
    }
};
