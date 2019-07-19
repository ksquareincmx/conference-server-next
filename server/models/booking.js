const {
  bookingAfterFindRemoteHook
} = require("./bookingMethods/bookingAfterFindRemoteHook");
const {
  bookingBeforeSaveHook
} = require("./bookingMethods/bookingBeforeSaveHook");

module.exports = function(Booking) {
  Booking.observe("before save", bookingBeforeSaveHook);

  Booking.afterRemote("find.**", bookingAfterFindRemoteHook);
};
