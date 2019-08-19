'use strict';

const { restApiRoot, authExcluded } = require('../config.local.js');
const { slackService: { validateSignature } } = require('../services/slackService/slackService');
const { isValid: verifyJwt } = require('../services/jwtService');


module.exports = function (opts) {

  /**
   * Middleware to load the 'currentUser' into the req
   * it also can handle slack signed requests setting 'slackAccess' flag into the req
   */
  return async function (req, res, next) {

    let token = req.headers['authorization'] || req.headers['auth'] || req.query.access_token;

    if (req.headers["x-slack-signature"]
      && req.headers["x-slack-request-timestamp"]) {

      req.slackAccess = validateSignature(req);
      return next();
    } else if(token) {

      const { id } = await verifyJwt(token);

      const { user: User } = req.app.models;

      req.currentUser = await User.findById(id);

      next();

    } else {
      next();
    }

  };

};
