import log4js from 'log4js';
import config from './config';
import App from './app';
import { configLogger } from './config/log4js';

log4js.configure(configLogger);
const logger = log4js.getLogger('ServerIndex');
const app = new App(config);

const start = async () => {
  try {
    app.loadModules();
    await app.startServer();
    process.on('unhandledRejection', reason => {
      logger.info('Possibly Unhandled Rejection at : ', reason);
    });
  } catch (err) {
    logger.error(err);
  }
};
start();
