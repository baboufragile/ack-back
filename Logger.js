import log4js from 'log4js';

export default class Logger {
    static getLogger(filePath) {
        return log4js.getLogger(filePath);
    }
}

log4js.configure({
    appenders: {
        everything: {
            type: 'stdout',
            layout: {
                type: 'pattern', pattern: '%d{yyyy/MM/dd-hh.mm.ss} %p %c : %m%n'
            }
        }
    },
    categories: {
        default: {appenders: ['everything'], level: 'info'}
    }
});

const logger = Logger.getLogger('src/loggers/Logger.js');

process.on('uncaughtException', function (err) {
    logger.error('Native uncaughtException', err);
}).on('unhandledRejection', function (err) {
    logger.error('Native unhandledRejection', err);
});
