const bookingBeforeSaveHook = (ctx, next) => {
  const { Model: Booking } = ctx;
  const { instance } = ctx;
  const { start, end, room_id } = instance;

  // TODO: do this in a fancier fashion
  if (start.toString() === end.toString()) {
    return next({
      status: 400,
      message: "Start and end cannot be the same time"
    });
  }

  Booking.findOne(
    {
      where: {
        room_id,
        or: [
          {
            end: {
              between: [start, end]
            }
          },
          {
            start: {
              between: [start, end]
            }
          }
        ]
      }
    },
    (err, booking) => {
      let bookingErr = err;
      if (booking) {
        bookingErr = {
          status: 400,
          message: "There is already an appointment on this room" // TODO: add room
        };
      }
      next(bookingErr);
    }
  );
};

module.exports = { bookingBeforeSaveHook };
