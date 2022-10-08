import { Request, Response, NextFunction } from 'express';
import authenticated from '../../middleware/authenticated';
import { UserInterface } from '../../models/User';
import ChatService from '../../services/admin/chatService';
import Controller from '../../utils/interfaces/controller';
import AdminController from './adminController';

export default class ChatController
    extends AdminController
    implements Controller
{
    private service = new ChatService();

    constructor() {
        super();
        this.path += '/chat';
        this.viewPath += '/chat';
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(`${this.path}`, authenticated, this.chat);
        this.router.get(
            `${this.path}/get-messages`,
            authenticated,
            this.getMessages
        );
        this.router.post(`${this.path}/send`, authenticated, this.sendMessage);
    }

    private getMessages = async (
        req: Request<{}, {}, {}, { to: string; offset: string }>,
        res: Response
    ) => {
        const { to: toUser, offset } = req.query;
        const user = req.user as UserInterface;
        const userData = await this.service.getUserById(toUser, {
            photo: 1,
            username: 1,
            email: 1,
            createdAt: 1,
            backgroundPhoto: 1,
        });
        const data = await this.service.getMessages(user._id, toUser, offset);

        return res.json({ data, userData });
    };

    private chat = async (
        req: Request<{}, {}, {}, { to: string }>,
        res: Response
    ) => {
        const { to: toUser } = req.query;
        const selectedUser = await this.service.getUserById(toUser, {
            password: 0,
        });
        const user = req.user as UserInterface;
        const conversations = await this.service.getConversationsWith(user._id);

        return res.render(`${this.viewPath}/chat`, {
            selectedUser,
            conversations: conversations,
        });
    };

    private sendMessage = async (
        req: Request<{}, {}, { to: string; message: string }>,
        res: Response,
        next: NextFunction
    ) => {
        const { to: toUser, message } = req.body;
        try {
            const user = req.user as UserInterface;
            await this.service.sendMessage(user._id, toUser, message);
            return res.json({ success: true });
        } catch (error: any) {
            return next(new Error(error.message));
        }
    };
}
