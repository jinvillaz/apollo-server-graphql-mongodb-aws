import config from './config';
const { server, razer } = config;

export default {
  host: process.env.HOST || server.host,
  port: process.env.PORT || server.port,
  environment: process.env.NODE_ENV,
  razerAppCode: process.env.APP_CODE || razer.APP_CODE,
  razerAppPin: process.env.APP_PIN || razer.APP_PIN,
};
