"use strict";
const { userBeforeSave } = require("./userMethods/userBeforeSave");

module.exports = function(User) {
  User.observe("before save", userBeforeSave);
};
