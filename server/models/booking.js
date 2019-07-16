const beforeSaveHook = require("./BookingMethods/beforeSaveHook");

module.exports = function(Booking) {
  Booking.observe("before save", beforeSaveHook);
};
