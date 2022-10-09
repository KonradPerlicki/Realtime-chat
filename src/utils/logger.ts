import winston from 'winston';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';

const myFormat = winston.format.printf(({ level, message }) => {
    return `[${dayjs().format()}] - ${capitalize(level)}: ${message}`;
});

const allLogsFile = new winston.transports.File({
    filename: 'var/logs/all-logs.log',
});

const logger = winston.createLogger({
    format: myFormat,
    exceptionHandlers: [
        new winston.transports.File({ filename: 'var/logs/exceptions.log' }),
    ],
    transports: [
        new winston.transports.File({
            filename: 'var/logs/error.log',
            level: 'error',
        }),
    ],
});

if (<string>process.env.env !== 'prod') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), myFormat),
        })
    );
} else {
    logger.add(allLogsFile);
}

export default logger;
