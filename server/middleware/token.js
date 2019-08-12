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

    for (let excluded of authExcluded) {
      excluded = excluded.trim();
      if (req._parsedUrl.pathname === `${restApiRoot}${excluded}` || req._parsedUrl.pathname.indexOf(excluded) === 0) {
        return next();
      }
    }

    let token = req.headers['Authorization'] || req.headers['Auth'] || req.query.access_token;

    if (req.headers["x-slack-signature"]
      && req.headers["x-slack-request-timestamp"]) {

      req.slackAccess = validateSignature(req);
      return next();
    } else {

      try {

        const { id } = await verifyJwt(token);

        const { user: User } = req.app.models;

        req.currentUser = await User.findById(id);

        next();

      } catch (e) {
        next(e);
      }

    }

  };

};
