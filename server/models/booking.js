const {
  bookingAfterFindRemoteHook
} = require("./bookingMethods/bookingAfterFindRemoteHook");
const {
  bookingBeforeSaveOperationHook
} = require("./bookingMethods/bookingBeforeSaveOperationHook");
const {
  bookingAfterDeleteOperationHook
} = require("./bookingMethods/bookingAfterDeleteOperationHook");
const {
  bookingBeforeDeleteOperationHook
} = require("./bookingMethods/bookingBeforeDeleteOperationHook");

module.exports = function(Booking) {
  Booking.observe("before save", bookingBeforeSaveOperationHook);
  Booking.observe("after delete", bookingAfterDeleteOperationHook);
  Booking.observe("before delete", bookingBeforeDeleteOperationHook);
  Booking.afterRemote("find.**", bookingAfterFindRemoteHook);
};
