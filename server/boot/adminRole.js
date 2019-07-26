module.exports = App => {
  const { Role, user } = App.models;

  Role.registerResolver("admin", (role, context, cb) => {
    const denied = () => process.nextTick(() => cb(null, false));
    const granted = (bool = true) => process.nextTick(() => cb(null, bool));

    const { userId } = context.accessToken;
    if (!userId) {
      return denied();
    }

    user.findById(userId, (err, currentUser) => {
      if (err) {
        throw new Error("Error in adminRole.js", error);
      }
      return granted(currentUser.role === "admin");
    });
    // return granted(currentUser.role === "admin");
  });
};
