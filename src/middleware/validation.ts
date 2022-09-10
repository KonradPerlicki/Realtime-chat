import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';

export default function validation(schema: Joi.Schema): RequestHandler {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };

        try {
            const value = await schema.validateAsync(
                req.body,
                validationOptions
            );
            req.body = value;

            return next();
        } catch (e: any) {
            const errors: object[] = [];
            e.details.forEach((error: Joi.ValidationErrorItem) => {
                errors.push({
                    message: error.message,
                    field: error.path[0],
                });
            });
            return res.status(400).send({ errors });
        }
    };
}
