"use strict";

const { slackLogin, googleLogin } = require("../controllers/user/methods");
const { userBeforeSaveHook } = require("../controllers/user/hooks");

module.exports = function(User) {
  User.observe("before save", userBeforeSaveHook);

  User.slackLogin = slackLogin(User);
  User.remoteMethod(slackLogin.name, slackLogin.config);

  User.googleLogin = googleLogin(User);
  User.remoteMethod(googleLogin.name, googleLogin.config);
};
