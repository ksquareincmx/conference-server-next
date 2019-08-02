"use strict";
const { userBeforeSave } = require("../controllers/user/userBeforeSave");

module.exports = function(User) {
  User.observe("before save", userBeforeSave);
};
