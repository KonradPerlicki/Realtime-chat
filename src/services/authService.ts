import { randomBytes } from 'crypto';
import passport from 'passport';
import UserNotFoundException from '../exceptions/userNotFoundException';
import Token from '../models/Token';
import User from '../models/User';
import Mailer from '../utils/mailer';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { assign } from 'lodash';
import MainService from './mainService';
export default class AuthService extends MainService {
    constructor() {
        super();
        this.registerGoogleStrategy();
    }

    /**
     * Register new user
     */
    public async register(username: string, email: string, password: string) {
        try {
            if (await User.findOne({ email: email })) {
                throw new Error('Email is already taken');
            }
            const user = await User.create({
                username,
                email,
                password,
            });

            delete user.password;
            return user;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async login(username: string, password: string) {
        const user = await User.findOne({ username: username });

        if (!user) {
            throw new UserNotFoundException('Invalid username or password');
        }

        if (await user.isValidPassword(password)) {
            delete user.password;
            return user;
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
            url: `${process.env.url}/admin/reset-password?token=${token.token}&id=${user._id}`,
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

    private registerGoogleStrategy() {
        passport.serializeUser((user, done) => {
            done(null, user);
        });
        passport.deserializeUser((user, done) => {
            done(null, null);
        });

        passport.use(
            new Strategy(
                {
                    scope: ['profile', 'email'],
                    clientID: <string>process.env.google_client_id,
                    clientSecret: <string>process.env.google_client_secret,
                    callbackURL: <string>process.env.google_callback_url,
                },
                async function (
                    accessToken: string,
                    refreshToken: string,
                    profile: Profile,
                    done: VerifyCallback
                ) {
                    const user = await User.findOne({ googleId: profile.id });
                    if (!user) {
                        if (!profile.emails) {
                            return done(new Error('Email not provided'));
                        }

                        const data = {
                            email: profile.emails[0].value,
                            googleId: profile.id,
                        };
                        if (profile.photos) {
                            assign(data, { photo: profile.photos[0].value });
                        }
                        try {
                            const user = await User.create(data);
                            return done(null, user);
                        } catch (error: any) {
                            if (error.message.includes('duplicate')) {
                                error.message = 'Email is already taken';
                            }
                            return done(null, false, error.message);
                        }
                    }
                    return done(null, user);
                }
            )
        );
    }
}
