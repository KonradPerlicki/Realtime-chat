import express, { Express } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';
import compression from 'compression';
import logger from './utils/logger';
import errorHandle, { notFoundRoute } from './middleware/errorHandle';
import { join } from 'path';
import deserializeUser from './middleware/deserializeUser';
import cookieParser from 'cookie-parser';
import readRecursive from 'fs-readdir-recursive';
import session from 'express-session';
import passport from 'passport';
import fileUpload from 'express-fileupload';
import http from 'http';
import flashData from './middleware/flashData';
import dotenv from 'dotenv';
dotenv.config();

export default class App {
    public app: Express;
    private port: number;
    public static server: http.Server;

    constructor(port: number) {
        this.app = express();
        App.server = http.createServer(this.app);
        this.port = port;

        this.initialiseMiddlewares();
        this.connectToDb();

        this.initialisecontrollers();

        App.server.listen(process.env.PORT || this.port, () => {
            logger.info('App listening on port ' + this.port);
        });
    }

    private async initialisecontrollers() {
        const controllers = readRecursive(join(__dirname, '/controllers'));
        for (const filePath of controllers) {
            const controller = await import('./controllers/' + filePath);
            this.app.use(new controller.default().router);
        }

        this.initialiseErrorHandling();
    }

    private initialiseMiddlewares(): void {
        this.app.use(
            helmet({
                contentSecurityPolicy: {
                    directives: {
                        imgSrc: ['*', 'data:'],
                        scriptSrc: [
                            "'nonce-allow'",
                            "'self'",
                            "'unsafe-inline'",
                        ],
                    },
                },
            })
        );

        this.app.use(morgan('dev'));
        this.app.use(express.json());
        this.app.use(
            session({
                secret: <string>process.env.session_secret,
                resave: true,
                saveUninitialized: true,
            })
        );
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(compression());
        this.app.use(express.static('public/'));
        this.app.use(fileUpload());
        this.app.set('view engine', 'ejs');
        this.app.set('views', join(__dirname, '../public/views'));

        this.app.use(deserializeUser);
        this.app.use(flashData);
    }

    private initialiseErrorHandling(): void {
        this.app.use(errorHandle);
        this.app.use(notFoundRoute);
    }

    private connectToDb(): void {
        const dbUri = <string>process.env.dbUri;

        mongoose.connect(dbUri).then(() => {
            logger.info('DB connection established');
        });
    }
}

const port = Number(process.env.port);

new App(port);
