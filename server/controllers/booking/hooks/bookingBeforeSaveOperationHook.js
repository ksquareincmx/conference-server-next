const moment = require("moment-timezone");
const { calendarService } = require("../../../services/calendarService");
const { log } = require("../../../libraries/log");
const { errorFactory } = require("../../../factories/ErrorFactory");
const { isAlreadyBooked } = require("../queries");
const { getActualDate } = require("../../../utils");

const isAvailableDay = (day, workingDays) => workingDays.includes(day);

const isAvailableHour = (starHour, endHour, validWorkingHours) =>
  starHour >= validWorkingHours.from && endHour <= validWorkingHours.to;

/**
  TODO: improve this function to support multiple workingHours
  workingHours = [
    {
      from: "09:00",
      to: "14:00"
    },
    {
      from: "15:00",
      to: "19:00"
    }
  ]
  cannot schedule from 14:01 to 14:59
*/
const withinOfficeHours = (start, end, officeConfig) => {
  const { timezone, workingHours, workingDays } = officeConfig;

  const startDate = moment(start).tz(timezone);
  const endDate = moment(end).tz(timezone);

  // Check if the hours is in office hours
  const [firstWorkingHours] = workingHours;

  return (
    isAvailableDay(startDate.isoWeekday(), workingDays) &&
    isAvailableHour(
      startDate.format("HH:mm"),
      endDate.format("HH:mm"),
      firstWorkingHours
    )
  );
};

const bookingBeforeSaveOperationHook = (ctx, next) => {
  try {
    const { Model: Booking } = ctx;
    const { Room, user } = ctx.Model.app.models;
    const { officeConfig } = ctx.Model.app;
    const { instance } = ctx;
    const { start, end, room_id, attendees, description } = instance;
    const { accessToken: token } = ctx.options;
    if (start.toString() === end.toString()) {
      return next(errorFactory.cannotOverlap());
    }

    if (start > end) {
      return next(errorFactory.wrongStartTime());
    }

    if (getActualDate() > start) {
      return next(errorFactory.cannotScheduleForYesterday());
    }

    if (!withinOfficeHours(start, end, officeConfig)) {
      return next(errorFactory.cannotScheduleOutsideOfficeHours(workingHours));
    }

    Booking.find(isAlreadyBooked(room_id, start, end), async (err, booking) => {
      let ownerUserId = token ? token.userId : instance.user_id;
      const { email: ownerEmail } = await user.findById(ownerUserId);
      const { name: location } = await Room.findById(room_id);
      let bookingErr = err;
      const [firstBooking] = booking;
      if (firstBooking && ctx.isNewInstance && booking.length === 1) {
        bookingErr = errorFactory.cannotOverlap(firstBooking.room.name);
      } else if (firstBooking && !ctx.isNewInstance) {
        // The owner is the
        if (firstBooking.id === instance.id) {
          const { event_id } = await Booking.findById(instance.id);
          const eventUpdated = await calendarService.updateEvent(
            event_id,
            start,
            end,
            description,
            [...attendees, ownerEmail],
            location
          );

          return next();
        }
      }

      if (!bookingErr) {
        if (ctx.isNewInstance) {
          if (instance.event_id === "" || !instance.event_id) {
            const { id: event_id } = await calendarService.insertEvent(
              start,
              end,
              description,
              [...attendees, ownerEmail],
              location
            );
            ctx.instance.event_id = event_id;
          }
        }
      }
      next(bookingErr);
    });
  } catch (error) {
    log.error(`Error in bookingBeforeSaveOperationHook.js`, error);
  }
};

module.exports = bookingBeforeSaveOperationHook;
