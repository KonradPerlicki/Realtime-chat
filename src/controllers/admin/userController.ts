import { NextFunction, Request, Response } from 'express';
import authenticated from '../../middleware/authenticated';
import { UserInterface } from '../../models/User';
import UserService from '../../services/admin/userService';
import Controller from '../../utils/interfaces/controller';
import AdminController from './adminController';

export default class UserController
    extends AdminController
    implements Controller
{
    private service = new UserService();

    constructor() {
        super();
        this.path += '/user';
        this.viewPath += '/user';
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(`${this.path}/:id`, authenticated, this.userProfile);
    }

    private userProfile = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const { id } = req.params;

        try {
            const user = await this.service.userProfile(id);
            const authenticatedUser = req.user as UserInterface;
            const owner = authenticatedUser.id === user?._id.toString();

            return res.render(`${this.viewPath}/userProfile`, {
                usr: user,
                owner: owner,
            });
        } catch (error: any) {
            //without error so we display 404 page for wrong url
            return next();
        }
    };
}
