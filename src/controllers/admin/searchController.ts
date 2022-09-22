import { Request, Response } from 'express';
import authenticated from '../../middleware/authenticated';
import SearchService from '../../services/admin/searchService';
import Controller from '../../utils/interfaces/controller';
import AdminController from './adminController';

export default class SearchController
    extends AdminController
    implements Controller
{
    private service = new SearchService();

    constructor() {
        super();
        this.path += '/search';
        this.viewPath += '/search';
        this.initialiseRoutes();
    }

    private initialiseRoutes(): void {
        this.router.get(`${this.path}`, authenticated, this.search);
    }

    private search = async (
        req: Request<{}, {}, {}, { q: string }>,
        res: Response
    ) => {
        const data = await this.service.search(req);
        return res.json(data);
    };
}
