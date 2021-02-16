import http from 'http';
import log4js from 'log4js';
import morgan from 'morgan';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import errorHandler from 'errorhandler';
import { ApolloServer } from 'apollo-server-express';
import DBManager from './modules/database';
import { typeDefs, Resolvers, UserValidator } from './modules/graphql';

const logger = log4js.getLogger('App');

/**
 * Module main app.
 */
export default class App {
  /**
   * @param  {Object} config for app.
   */
  constructor(config) {
    this.app = express();
    this.config = config;
    this.setConfiguration(this.app, config);
  }

  /**
   * Sets the basic configuration.
   * @param {Object} app express.
   * @param {Object} config for app.
   */
  setConfiguration(app, config) {
    if (config.environment === 'development') {
      logger.info('configuration for develop');
      app.use(errorHandler());
      app.use(morgan('dev'));
    } else {
      app.use(morgan('combined'));
    }
    app.set('port', config.port);
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
    this.addErrorHandler(app);
  }

  /**
   * Adds the error handler.
   * @param {Object} app is the main app.
   */
  addErrorHandler(app) {
    // eslint-disable-next-line prettier/prettier
    app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
      const status = err.status || 500;
      res.status(status);
      res.json({ message: err.message });
    });
  }

  /**
   * Load modules.
   * @return {Promise} a new promise.
   */
  async loadModules() {
    await DBManager.connect();
    Resolvers.loadModels();
    const server = new ApolloServer({
      typeDefs,
      resolvers: Resolvers.getResolvers(),
      context: UserValidator.getUser,
      debug: false,
    });
    server.applyMiddleware({ app: this.app });
  }

  /**
   * Returns app server.
   * @return {*} app server.
   */
  getAppServer() {
    return this.app;
  }

  startServer() {
    return new Promise(resolve => {
      this.httpServer = http.createServer(this.app);
      const port = this.app.get('port');
      this.httpServer.listen(port, () => {
        logger.info('Web server listening on port ' + port);
        resolve();
      });
    });
  }
}
