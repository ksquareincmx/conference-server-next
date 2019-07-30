const { calendarService } = require("../../services/calendarService");
const { log } = require("../../libraries/log");

const bookingAfterDeleteOperationHook = async (ctx, next) => {
  const {
    event: { event_id }
  } = ctx.hookState;
  try {
    if (event_id) {
      await calendarService.deleteEvent(event_id);
    }
    // Remove Data
    return await Promise.resolve(next);
  } catch (error) {
    log.error(error);
    next(error);
  }
};

module.exports = { bookingAfterDeleteOperationHook };
