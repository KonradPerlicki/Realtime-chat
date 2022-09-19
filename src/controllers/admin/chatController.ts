import { Request, Response } from 'express';
import authenticated from '../../middleware/authenticated';
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
    }

    private chat = (req: Request, res: Response) => {
        res.render(`${this.viewPath}/chat`);
    };
}
