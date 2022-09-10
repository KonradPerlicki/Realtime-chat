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

export default class AuthController
    extends BaseController
    implements Controller
{
    public path = '/';
    private service = new AuthService();

    constructor() {
        super();
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(`${this.path}login`, this.login);
        this.router.post(`${this.path}login`, this.handleLogin);

        this.router.get(`${this.path}register`, this.register);
        this.router.post(
            `${this.path}register`,
            validation(validateSchema.registerUser),
            this.handleRegister
        );

        this.router.delete(`${this.path}logout`, authenticated, this.logout);
    }

    private login = (req: Request, res: Response) => {
        return res.render('auth/login');
    };

    private handleLogin = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const { username, password } = req.body;
        try {
            const { accessToken, refreshToken, user } =
                await this.service.login(username, password);
            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 15, // 15 minutes
                httpOnly: true,
            });

            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
                httpOnly: true,
            });

            return res.json({ user });
        } catch (error: any) {
            return next(new UserNotFoundException(error.message));
        }
    };

    private register = (req: Request, res: Response) => {
        return res.render('auth/register');
    };

    private logout = (req: Request, res: Response) => {
        res.clearCookie('accessToken');

        res.clearCookie('refreshToken');

        res.cookie('success', ['Successfully logged out'], { httpOnly: true });
        return res.json({ success: true });
    };

    private handleRegister = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { username, email, password } = req.body;

            const { accessToken, refreshToken, user } =
                await this.service.register(username, email, password);

            res.cookie('accessToken', accessToken, {
                maxAge: 1000 * 60 * 15, // 15 minutes
                httpOnly: true,
            });

            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
                httpOnly: true,
            });

            return res.status(StatusCodes.CREATED).json({ user });
        } catch (error: any) {
            return next(new ValidationException(error.message));
        }
    };
}
