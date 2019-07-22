// TODO: return all room, user, booking together
const bookingAfterFindRemoteHook = (ctx, modelInstance, next) => {
  const { user, Room } = ctx.req.app.models;
  next();
};

module.exports = { bookingAfterFindRemoteHook };
