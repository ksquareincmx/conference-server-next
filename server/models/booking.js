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

  Booking.slackCommand = async function (req, res) {

    res.send('Waiting for server');

    console.log(req);

  };

  Booking.remoteMethod('slackCommand', {
    http: {
      verb: 'POST',
      path: '/slack/command'
    },
    accepts: [
      {
        arg: 'req',
        type: 'object',
        root: true,
        http: {
          source: 'req'
        }
      },
      {
        arg: 'res',
        type: 'object',
        root: true,
        http: {
          source: 'res'
        }
      }
    ]
  });

};
