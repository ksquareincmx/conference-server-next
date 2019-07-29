const {
  bookingAfterFindRemoteHook
} = require("./bookingMethods/bookingAfterFindRemoteHook");
const {
  bookingBeforeSaveOperationHook
} = require("./bookingMethods/bookingBeforeSaveOperationHook");
const {
  bookingAfterDeleteOperationHook
} = require("./bookingMethods/bookingAfterDeleteOperationHook");


module.exports = function(Booking) {
  Booking.observe("before save", bookingBeforeSaveOperationHook);
  Booking.observe("after delete", bookingAfterDeleteOperationHook);
  Booking.afterRemote("find.**", bookingAfterFindRemoteHook);
};
