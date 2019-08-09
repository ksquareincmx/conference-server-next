'use strict';

const { env } = process;
let { version } = require("../package.json");
version = version.split(".").shift();

const { config: conf } = require('./config/config');

const config = {
  ...conf,
  appUri: env.APP_URI,
  jwtSecret: env.JWT_SECRET,
  jwtAlgo: env.JWT_ALGO,
  authExcluded: (env.AUTH_EXCLUDED && env.AUTH_EXCLUDED.split(','))|| [],
  restApiRoot: `/api${version > 0 ? `/v${version}` : ""}`
};

config.auth.slack.appPath = `${config.restApiRoot}/slack/`;

module.exports = config;
