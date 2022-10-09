import { UserInterface } from '../models/User';
import jwt from 'jsonwebtoken';

const formatUserData = (user: UserInterface) => {
    return {
        _id: user._id.toString() as string,
        username: user.username,
        email: user.email,
        title: user.title,
        firstName: user.firstName,
        lastName: user.lastName,
        description: user.description,
        photo: user.photo,
        backgroundPhoto: user.backgroundPhoto,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

type Tokens = 'access' | 'refresh';
export const createToken = (user: UserInterface, type: Tokens) => {
    const payload = formatUserData(user);
    const secret = <string>process.env[type + '_token_secret'];
    const expire = <string>process.env[type + '_token_expire'];
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
        const secret = <string>process.env[type + '_token_secret'];
        const decoded = jwt.verify(token, secret);
        return { user: decoded as UserInterface, expired: false };
    } catch (error) {
        return { user: null, expired: true };
    }
};
