import { Response, Request, NextFunction } from 'express';
import HttpException from '../exceptions/httpException';
import logger from '../utils/logger';

export default function errorHandle(
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const status = error.status || 500;
    const message = error.message || 'Something went wrong';

    logger.error(message);
    return res.status(status).send({ status, message });
}

export function notFoundRoute(req: Request, res: Response) {
    return res.render('error/404');
}
