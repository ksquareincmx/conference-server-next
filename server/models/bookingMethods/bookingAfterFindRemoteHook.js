// TODO: return all room, user, booking together
const bookingAfterFindRemoteHook = (ctx, modelInstance, next) => {
  const { user, Room } = ctx.req.app.models;
  console.log(ctx.result);
  next();
};

module.exports = { bookingAfterFindRemoteHook };
