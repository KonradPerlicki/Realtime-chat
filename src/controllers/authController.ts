import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/authService';
import Controller from '../utils/interfaces/controller';
import BaseController from './baseController';
import validation from '../middleware/validation';
import validateSchema from '../middleware/validationSchemas/authValidation';
import ValidationException from '../exceptions/validationException';
import StatusCodes from 'http-status-codes';
import authenticated from '../middleware/authenticated';
import UserNotFoundException from '../exceptions/userNotFoundException';
import guestOnly from '../middleware/guestOnly';
import { emailRequestLimiter } from '../utils/rateLimiters';
import passport from 'passport';
import { UserInterface } from '../models/User';

export default class AuthController
    extends BaseController
    implements Controller
{
    public path = '/admin/';
    private service = new AuthService();

    constructor() {
        super();
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(`${this.path}login`, guestOnly, this.login);
        this.router.post(`${this.path}login`, guestOnly, this.handleLogin);

        this.router.get(
            `${this.path}login/google`,
            guestOnly,
            passport.authenticate('google')
        );
        this.router.get(
            `${this.path}google/callback`,
            passport.authenticate('google', {
                failureRedirect: '/admin/google/failure',
                failureMessage: true,
            }),
            this.handleGoogleLogin
        );
        this.router.get(`${this.path}google/failure`, this.handleGoogleError);

        this.router.get(`${this.path}register`, guestOnly, this.register);
        this.router.post(
            `${this.path}register`,
            [guestOnly, validation(validateSchema.registerUser)],
            this.handleRegister
        );

        this.router.delete(
            `${this.path}logout`,
            authenticated,
            this.handleLogout
        );
        this.router.get(`${this.path}logout`, guestOnly, this.logout);

        this.router.get(
            `${this.path}forgot-password`,
            guestOnly,
            this.forgotPassword
        );

        this.router.post(
            `${this.path}forgot-password`,
            [emailRequestLimiter, guestOnly],
            this.handleForgotPassword
        );
        this.router.get(
            `${this.path}reset-password`,
            guestOnly,
            this.resetPassword
        );
        this.router.post(
            `${this.path}reset-password`,
            [guestOnly, validation(validateSchema.resetPassword)],
            this.handleResetPassword
        );
    }

    private login = (req: Request, res: Response) => {
        res.cookie('success', ['Successfully changed password'], {
            httpOnly: true,
        });
        return res.render('auth/login');
    };

    private handleLogin = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { username, password } = req.body;
        try {
            const user = await this.service.login(username, password);
            this.service.registerTokens(res, user);

            return res.json({ user });
        } catch (error: any) {
            return next(new UserNotFoundException(error.message));
        }
    };

    private handleGoogleLogin = (req: Request, res: Response) => {
        const user = req.user as UserInterface;
        this.service.registerTokens(res, user);

        return res.redirect('/admin/chat');
    };

    private handleGoogleError = (req: Request, res: Response) => {
        const { messages } = req.session as Express.CustomSession;
        res.cookie('errors', messages, { httpOnly: true });
        return res.redirect('/admin/login');
    };

    private register = (req: Request, res: Response) => {
        return res.render('auth/register');
    };

    private handleLogout = (req: Request, res: Response) => {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.cookie('loggedOut', true, { httpOnly: true });
        return res.json({ success: true });
    };

    private logout = (req: Request, res: Response) => {
        const { loggedOut } = req.cookies;
        res.clearCookie('loggedOut');
        if (!loggedOut) return res.redirect('/admin/login');
        return res.render('auth/logout');
    };

    private handleRegister = async (
        req: Request<
            {},
            {},
            { username: string; email: string; password: string }
        >,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username, email, password } = req.body;

            const user = await this.service.register(username, email, password);

            this.service.registerTokens(res, user);

            return res.status(StatusCodes.CREATED).json({ user });
        } catch (error: any) {
            return next(new ValidationException(error.message));
        }
    };

    private forgotPassword = (req: Request, res: Response) => {
        res.render('auth/forgotPassword');
    };

    private handleForgotPassword = async (
        req: Request<{}, {}, { email: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const { email } = req.body;
        try {
            await this.service.sendForgotEmail(email);
            return res.json({ success: true });
        } catch (error: any) {
            return next(new Error(error.message));
        }
    };

    private resetPassword = async (
        req: Request<
            {},
            {},
            {},
            {
                token: string;
                id: string;
            }
        >,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { token, id: userId } = req.query;
            await this.service.validateUrl(token, userId);
            res.render('auth/resetPassword', {
                userId,
            });
        } catch (error: any) {
            return next();
        }
    };

    private handleResetPassword = async (
        req: Request<{}, {}, { password: string; userId: string }>,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const { password, userId } = req.body;

            await this.service.resetPassword(userId, password);
            res.cookie('success', ['Successfully changed password'], {
                httpOnly: true,
            });
            return res.json({ success: true });
        } catch (error: any) {
            return next(new UserNotFoundException(error.message));
        }
    };
}
