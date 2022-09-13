import { randomBytes } from 'crypto';
import UserNotFoundException from '../exceptions/userNotFoundException';
import Token from '../models/Token';
import User from '../models/User';
import { createToken } from '../utils/jwt';
import Mailer from '../utils/mailer';

export default class AuthService {
    /**
     * Register new user
     */
    public async register(username: string, email: string, password: string) {
        try {
            const createdUser = await User.create({
                username,
                email,
                password,
            });
            const user = createdUser.toObject();
            delete user.password;

            const accessToken = createToken(createdUser, 'access');
            const refreshToken = createToken(createdUser, 'refresh');

            return { accessToken, refreshToken, user };
        } catch (error: any) {
            throw new Error('Unable to register user, ' + error.message);
        }
    }

    public async login(username: string, password: string) {
        const user = await User.findOne({ username: username });

        if (!user) {
            throw new UserNotFoundException('Invalid username or password');
        }

        if (await user.isValidPassword(password)) {
            const accessToken = createToken(user, 'access');
            const refreshToken = createToken(user, 'refresh');
            return { accessToken, refreshToken, user };
        } else {
            throw new UserNotFoundException('Invalid username or password');
        }
    }

    public async sendForgotEmail(email: string) {
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new UserNotFoundException(
                'User with email ' + email + ' does not exist'
            );
        }
        await Token.deleteMany({ userId: user._id });
        const token = await Token.create({
            userId: user._id,
            token: randomBytes(32).toString('hex'),
        });
        const subject = 'Password change request';
        const templateData = {
            url: `http://localhost:3000/reset-password?token=${token.token}&id=${user._id}`,
        };

        await Mailer.send(email, subject, 'forgotPassword', templateData);
    }

    public async validateUrl(
        token: string,
        userId: string
    ): Promise<void | never> {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            throw new Error('Invalid url provided');
        }
        const tokenExists = await Token.findOne({
            userId: userId,
            token: token,
        });
        if (!tokenExists) {
            throw new Error('Invalid url provided');
        }
    }

    public async resetPassword(
        userId: string,
        newPassword: string
    ): Promise<void | never> {
        const user = await User.findById(userId);
        if (user) {
            user.password = newPassword;
            await user.save();
            await Token.deleteMany({ userId: userId });
        } else {
            throw new UserNotFoundException('User not found');
        }
    }
}
