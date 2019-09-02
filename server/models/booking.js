const {
  bookingAfterFindRemoteHook,
  bookingBeforeSaveOperationHook,
  bookingAfterDeleteOperationHook,
  bookingBeforeDeleteOperationHook
} = require("../controllers/booking/hooks");
const { slackCommand } = require("../controllers/booking/methods");
const { slackInteraction } = require("../controllers/booking/methods");

module.exports = function(Booking) {
  Booking.observe("before save", bookingBeforeSaveOperationHook);
  Booking.observe("after delete", bookingAfterDeleteOperationHook);
  Booking.observe("before delete", bookingBeforeDeleteOperationHook);
  Booking.afterRemote("find.**", bookingAfterFindRemoteHook);

  Booking.slackCommand = slackCommand(Booking);
  Booking.slackInteraction = slackInteraction(Booking);

  Booking.remoteMethod(slackCommand.name, slackCommand.config);
  Booking.remoteMethod(slackInteraction.name, slackInteraction.config);
};
