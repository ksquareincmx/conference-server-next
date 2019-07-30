/**
 * Admin User
 */
const { app } = require("../config/config");

module.exports = App => {
  const { user } = App.models;
  user.create(
    {
      name: app.admin.name,
      email: app.admin.email,
      password: app.admin.password,
      role: "admin"
    },
    (err, user) => {
      if (err) {
        throw new Error(`Cannot create admin`, err);
      }
    }
  );
};
