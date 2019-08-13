'use strict';
const { log } = require("../../../libraries/log");

const bookingBeforeDeleteOperationHook = async (ctx, next) => {
  const { Model: Booking } = ctx;
  try {
    const { id } = ctx.where;
    let event = null;
    if (id) {
      event = await Booking.findById(id);
    }
    if (event) {
      ctx.hookState.event = event;
    }
    return Promise.resolve(next);
  } catch (error) {
    log.error(error);
    next(error);
  }
};

module.exports = bookingBeforeDeleteOperationHook;
