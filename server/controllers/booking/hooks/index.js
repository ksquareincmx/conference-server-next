'use strict';

module.exports = {
  bookingAfterDeleteOperationHook: require('./bookingAfterDeleteOperationHook'),
  bookingAfterFindRemoteHook: require('./bookingAfterFindRemoteHook'),
  bookingBeforeDeleteOperationHook: require('./bookingBeforeDeleteOperationHook'),
  bookingBeforeSaveOperationHook: require('./bookingBeforeSaveOperationHook'),
};
