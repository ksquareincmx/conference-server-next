const {
  bookingAfterFindRemoteHook
} = require("../controllers/booking/bookingAfterFindRemoteHook");
const {
  bookingBeforeSaveOperationHook
} = require("../controllers/booking/bookingBeforeSaveOperationHook");
const {
  bookingAfterDeleteOperationHook
} = require("../controllers/booking/bookingAfterDeleteOperationHook");
const {
  bookingBeforeDeleteOperationHook
} = require("../controllers/booking/bookingBeforeDeleteOperationHook");

module.exports = function(Booking) {
  Booking.observe("before save", bookingBeforeSaveOperationHook);
  Booking.observe("after delete", bookingAfterDeleteOperationHook);
  Booking.observe("before delete", bookingBeforeDeleteOperationHook);
  Booking.afterRemote("find.**", bookingAfterFindRemoteHook);
};
