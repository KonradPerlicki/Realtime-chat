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
        this.router.get(`${this.path}/edit`, authenticated, this.editProfile);
        this.router.put(
            `${this.path}/:id`,
            authenticated,
            this.updateEditProfile
        );
    }

    private updateEditProfile = async (
        req: Request<
            { id: string },
            {},
            {
                firstName: string;
                lastName: string;
                title: string;
                description: string;
            }
        >,
        res: Response,
        next: NextFunction
    ) => {
        const { firstName, lastName, title, description } = req.body;
        const { id } = req.params;
        try {
            const photos = await this.service.uploadFiles(req.files, [
                'photo',
                'backgroundPhoto',
            ]);

            const user = await this.service.updateUser(id, {
                firstName,
                lastName,
                title,
                description,
                ...photos,
            });
            this.service.registerTokens(res, user);
            return res.json({ success: true });
        } catch (error: any) {
            return next(new Error(error.message));
        }
    };

    private userProfile = async (
        req: Request<{ id: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const { id } = req.params;

        try {
            const user = await this.service.getUserById(id, {}, true);
            const authenticatedUser = req.user as UserInterface;
            const owner = authenticatedUser._id === user?._id.toString();

            return res.render(`${this.viewPath}/userProfile`, {
                searchedUser: user,
                owner: owner,
            });
        } catch (error: any) {
            //without error so we display 404 page for wrong url
            return next();
        }
    };

    private editProfile = (req: Request, res: Response) => {
        return res.render(`${this.viewPath}/editProfile`);
    };
}
