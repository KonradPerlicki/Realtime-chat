import Controller from '../../utils/interfaces/controller';
import BaseController from '../baseController';

interface AdminControllerInterface {
    viewPath: string;
}

export default abstract class AdminController
    extends BaseController
    implements Controller, AdminControllerInterface
{
    public path = '/admin';
    public viewPath = 'admin';
}
