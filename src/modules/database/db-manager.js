import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import log4js from 'log4js';

const logger = log4js.getLogger('DbConnection');
const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

/**
 * Module for manage the connection with mongodb.
 */
class DbManager {
  constructor() {
    this.urlConnection = 'mongodb://localhost:27017/test';
  }

  loadModels() {
    const pathModels = `${__dirname}/model`;
    const models = fs.readdirSync(pathModels);
    models.forEach(model => {
      const name = path.parse(model).name;
      require(`${pathModels}/${name}`);
    });
    logger.info('Models loaded. ', models.length);
  }

  /**
   * Connects with mongodb.
   * @returns {Object} mongoose object.
   */
  async connect() {
    this.urlConnection = process.env.MONGO_URL;
    await mongoose.connect(this.urlConnection, OPTIONS);
    logger.info('Successful database connection.');
    this.loadModels();
  }

  /**
   * Disconnects from mongodb.
   * @returns {Boolean} disconnection status.
   */
  async disconnect() {
    await mongoose.disconnect();
    logger.info('Successful database disconnection.');
  }
}

const dbManager = new DbManager();
export default dbManager;
