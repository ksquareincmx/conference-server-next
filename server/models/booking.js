const { bookingAccessHook } = require("./bookingMethods/bookingAccessHook");
const {
  bookingBeforeSaveHook
} = require("./bookingMethods/bookingBeforeSaveHook");

module.exports = function(Booking) {
  Booking.observe("before save", bookingBeforeSaveHook);

  Booking.observe("access", bookingAccessHook);
};
