"use strict";

const { restApiRoot, authExcluded } = require("../config.local.js");
const {
  slackService: { validateSignature }
} = require("../services/slackService/slackService");
const { isValid: verifyJwt } = require("../services/jwtService");
const { getTokenFromReq } = require("../libraries/getToken");

module.exports = function(opts) {
  /**
   * Middleware to load the 'currentUser' into the req
   * it also can handle slack signed requests setting 'slackAccess' flag into the req
   */
  return async function(req, res, next) {
    try {
      const token = getTokenFromReq(req);

      if (
        req.headers["x-slack-signature"] &&
        req.headers["x-slack-request-timestamp"]
      ) {
        req.slackAccess = validateSignature(req);
        return next();
      } else if (token) {
        const { id } = await verifyJwt(token);

        const { user: User } = req.app.models;
        let validUser = await User.findById(id);

        if (!validUser) {
          validUser = User.create({});
        }
        req.currentUser = await User.findById(id);

        next();
      } else {
        next();
      }
    } catch (e) {
      console.error(e);
      next();
    }
  };
};
