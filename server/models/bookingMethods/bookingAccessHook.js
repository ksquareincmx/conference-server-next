// TODO: return all room, user, booking together
const bookingAccessHook = (ctx, next) => {
  const { User, Room } = ctx.Model.app;

  next();
};

module.exports = { bookingAccessHook };
