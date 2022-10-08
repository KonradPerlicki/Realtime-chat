import { Request, Response, NextFunction } from 'express';
import authenticated from '../middleware/authenticated';
import Controller from '../utils/interfaces/controller';
import BaseController from './baseController';

export default class IndexController
    extends BaseController
    implements Controller
{
    public path = '/admin';

    constructor() {
        super();
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(this.path, authenticated, this.index);
    }

    private index(req: Request, res: Response) {
        res.redirect('/admin/chat');
        return res.render('index');
    }
}
