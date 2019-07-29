const calendarService = require("../../services/calendarService");
const { log } = require("../../libraries/log");

const bookingAfterDeleteOperationHook = async (ctx, next) => {
  try {
    const { id } = ctx.where;
    if (id) {
      const { event_id } = await ctx.Model.findById(id);
      await calendarService.deleteEvent(event_id);
    }
    // Remove Data
    next();
  } catch (error) {
    log.error(error);
    next(error);
  }
};

module.exports = { bookingAfterDeleteOperationHook };
