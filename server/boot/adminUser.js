/**
 * Admin User
 */
const { app } = require("../config/config");
const { make } = require('../services/jwtService');
const crypto = require('crypto');

module.exports = App => {
  const { user } = App.models;
  user.create(
    {
      name: app.admin.name,
      email: app.admin.email,
      password: crypto.randomBytes(20).toString('hex'),
      role: "admin"
    }, async (err, user) => {
      if (err) {
        throw new Error(`Cannot create admin`, err);
      }

      console.log('Admin token: ', `"${await make(user)}"`);
      
    }
  );
};
