const cannotOverlap = () => ({
  status: 422,
  message: "There is already an appointment on this room" // TODO: add room
});

const bookingBeforeSaveHook = (ctx, next) => {
  const { Model: Booking } = ctx;
  const { instance } = ctx;
  const { start, end, room_id } = instance;
  const hasInstanceId = instance.id || false;

  // TODO: do this in a fancier fashion
  if (start.toString() === end.toString()) {
    return next(cannotOverlap());
  }

  Booking.find(
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
      const [firstBooking] = booking;
      if (firstBooking && ctx.isNewInstance && booking.length === 1) {
        bookingErr = cannotOverlap();
      } else if (firstBooking && !ctx.isNewInstance) {
        // Will update
        if (firstBooking.id === instance.idx) {
          // return next();
        }
      }
      next(bookingErr);
    }
  );
};

module.exports = { bookingBeforeSaveHook };
