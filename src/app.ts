import express, { Express } from 'express';
import config from 'config';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import compression from 'compression';
import logger from './utils/logger';
import errorHandle from './middleware/errorHandle';
import Controller from './utils/interfaces/controller';
import IndexController from './controllers/indexController';
import { join } from 'path';
import AuthController from './controllers/authController';
import deserializeUser from './middleware/deserializeUser';
import cookieParser from 'cookie-parser';

class App {
    public app: Express;
    private port: number;

    constructor(port: number, controllers: Controller[]) {
        this.app = express();
        this.port = port;

        this.initialiseMiddlewares();
        this.connectToDb();

        this.initialisecontrollers(controllers);

        this.app.listen(this.port, () => {
            logger.info('App listening on port ' + this.port);
        });
    }

    private initialisecontrollers(controllers: Controller[]): void {
        controllers.forEach((route: Controller) => {
            this.app.use(route.router);
        });

        this.initialiseErrorHandling();
    }

    private initialiseMiddlewares(): void {
        this.app.use(helmet());
        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(compression());
        this.app.use(express.static('public'));
        this.app.set('view engine', 'ejs');
        this.app.set('views', join(__dirname, '../public/views'));

        this.app.use(deserializeUser);
        this.app.use((req, res, next) => {
            const { errors, success } = req.cookies;
            res.clearCookie('errors');
            res.clearCookie('success');
            res.locals.errors = errors ?? [];
            res.locals.success = success ?? [];

            return next();
        });
    }

    private initialiseErrorHandling(): void {
        this.app.use(errorHandle);
    }

    private connectToDb(): void {
        const dbUri = config.get<string>('dbUri');

        mongoose.connect(dbUri).then(() => {
            logger.info('DB connection established');
        });
    }
}

const port = config.get<number>('port');

const controllers = [new IndexController(), new AuthController()];
new App(port, controllers);
