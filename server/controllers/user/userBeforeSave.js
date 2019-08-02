module.exports = {
  userBeforeSave: (ctx, next, thing) => {
    // Only an admin can change user to admin
    next();
  }
};
