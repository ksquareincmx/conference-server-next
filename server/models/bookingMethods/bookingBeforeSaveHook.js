const bookingBeforeSaveHook = (ctx, next) => {
  const { Model: Booking } = ctx;
  const { instance } = ctx;
  const { start, end, roomId } = instance;

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
        and: [
          {
            start: {
              // gte: end
              between: [start, end]
            }
          },
          {
            end: {
              // lte: start
              between: [start, end]
            },
            roomId: {
              eq: roomId
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
          message: "There is an appointment overlaping" // TODO: add room
        };
      }
      next(bookingErr);
    }
  );
};

module.exports = { bookingBeforeSaveHook };
