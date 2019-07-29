const moment = require("moment-timezone");
const { calendarService } = require("../../services/calendarService");
const { log } = require("../../libraries/log");

const getActualDate = () =>
  moment()
    .utc()
    .format();

// TODO: have a some sort of config file for setting custom office preferences
const officeHours = {
  timezone: "America/Mexico_City",
  // Ideally we would write this like, { from: "monday": to: "friday" };
  workingDays: [1, 2, 3, 4, 5],
  workingHours: [
    {
      from: "08:00",
      to: "18:00"
    }
  ]
};

const onlyInOfficeHours = (start, end, timezone = "America/Mexico_City") => {
  const startDate = moment(start).tz(timezone);
  const endDate = moment(end).tz(timezone);

  // Check if is weekday
  const isAvailableDay = day => officeHours.workingDays.includes(day);

  // Check if the hours is in office hours
  const [firstWorkingHours] = officeHours.workingHours;

  const isAvailableHour = (starHour, endHour) =>
    starHour >= firstWorkingHours.from && endHour <= firstWorkingHours.to;

  return (
    isAvailableDay(startDate.isoWeekday()) &&
    isAvailableHour(startDate.format("HH:mm"), endDate.format("HH:mm"))
  );
};

const cannotOverlap = roomName => ({
  status: 422,
  message: `There is already an appointment on ${roomName}`
});

const cannotScheduleForYesterday = () => ({
  status: 422,
  message: "Cannot schedule room in the past"
});

const cannotScheduleOutsideOfficeHours = () => ({
  status: 422,
  message: `Cannot schedule outside office hours from ${officeHours.workingHours[0].from}-${officeHours.workingHours[0].to}`
});

const bookingBeforeSaveOperationHook = (ctx, next) => {
  try {
    const { Model: Booking } = ctx;
    const { Room, user } = ctx.Model.app.models;
    const { instance } = ctx;
    const { start, end, room_id, attendees, description } = instance;
    const { accessToken: token } = ctx.options;

    if (start.toString() === end.toString()) {
      return next(cannotOverlap());
    }

    if (getActualDate() > start) {
      return next(cannotScheduleForYesterday());
    }

    if (!onlyInOfficeHours(start, end)) {
      return next(cannotScheduleOutsideOfficeHours());
    }

    Booking.find(
      {
        where: {
          room_id,
          or: [
            {
              end: {
                between: [start, end]
              }
            },
            {
              start: {
                between: [start, end]
              }
            }
          ]
        },
        include: "room"
      },
      async (err, booking) => {
        const { email: ownerEmail } = await user.findById(token.userId);
        const { name: location } = await Room.findById(room_id);
        let bookingErr = err;
        const [firstBooking] = booking;
        if (firstBooking && ctx.isNewInstance && booking.length === 1) {
          bookingErr = cannotOverlap(firstBooking.room.name);
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
        next(bookingErr);
      }
    );
  } catch (error) {
    log.error(`Error in bookingBeforeSaveOperationHook.js`, error);
  }
};
module.exports = { bookingBeforeSaveOperationHook };
