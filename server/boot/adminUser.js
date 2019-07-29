/**
 * Admin User
 * michell.ayala@ksquareinc.com
 */

module.exports = App => {
  const { user } = App.models;
  user.create(
    {
      name: "Michell Ayala",
      email: "michell.ayala@ksquareinc.com",
      password: "KsquareConference2019",
      role: "admin"
    },
    (err, user) => {
      if (err) {
        throw new Error(`Cannot create admin`, err);
      }
    }
  );
};
