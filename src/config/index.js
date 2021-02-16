import config from './config';
const { server } = config;

export default {
  host: process.env.HOST || server.host,
  port: process.env.PORT || server.port,
  environment: process.env.NODE_ENV,
};
