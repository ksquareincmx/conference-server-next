const moment = require("moment-timezone");
const { getActualDate, isEmpty } = require("../../utils");
const isValidDate = date => date.toString() !== "Invalid date";

async function getAvailableBookingsByRoom(roomId, date) {
  const Room = this;
  const {
    officeConfig: { workingHours, timezone, minDuration }
  } = this.app;

  try {
    if (!isEmpty(date) && !isValidDate(date)) {
      return Promise.reject(
        new Error("Date must be a date in format YYYY-MM-DD")
      );
    }
    const currentRoom = await Room.findById(roomId);
    if (!currentRoom) {
      return Promise.reject(new Error(`Room ${roomId} doesn't exist`));
    }

    // We get al the bookings in that array of hours
    const isToday = () => moment().format("YYYY-MM-DD") === date;
    const dateTimestamp = moment(date).valueOf();
    const todayTimestamp = moment(date).valueOf();

    if (dateTimestamp < todayTimestamp) {
      return Promise.reject(new Error(`Cannot schedule in the past`));
    }
    // Getting bookings through the relation with bookings
    const roomBookings = await currentRoom.bookings.find({
      where: {
        start: {
          between: [
            `${date}T${workingHours[0].from}:00`,
            `${date}T${workingHours[0].to}:00`
          ]
        }
      }
    });
    // 1: Trim the array to get all the available hours
    // Catch1: Send me the available rooms

    const formatTime = time =>
      moment(time)
        .tz(timezone)
        .format()
        .slice(11, 16);

    const freshBookings = roomBookings.filter(
      ({ start }) => moment.now() < dateTimestamp
    );

    const existingBookings = freshBookings.map(({ start, end }) => ({
      start: formatTime(start),
      end: formatTime(end)
    }));

    // Add to occupiedHours edge Hours

    // nearestAvailable
    // Returns the closest "quarter" of hour
    const nearAvailable = () => {
      // TODO: Obviously make this smarter
      while (date.minutes() % minDuration !== 0) {
        date.add("minute", "1");
      }
      return date;
    };

    existingBookings.unshift({
      start: "00:00",
      end: !isToday() ? workingHours[0].from : formatTime(nearAvailable())
    });

    existingBookings.push({ start: "18:00", end: "23:59" });

    const rawAvailableBookings = existingBookings.map((booking, idx, arr) => {
      // Removing the last element which serves only as parameter
      if (booking.end === "23:59") {
        return null;
      }
      if (idx < arr.length - 1) {
        return booking.end !== arr[idx + 1].start
          ? { start: booking.end, end: arr[idx + 1].start }
          : null;
      }
      return booking;
    });
    const availableBookings = rawAvailableBookings.filter(booking => !!booking);
    return availableBookings;
  } catch (error) {}
}

const getAvailableBookingsByRoomDescription = {
  name: "available-bookings",
  description: "Get the available hours of the room",
  accepts: [
    {
      arg: "roomId",
      type: "string"
    },
    {
      arg: "date",
      type: "string"
    }
  ],
  returns: {
    arg: "bookings",
    type: "array",
    root: true
  }
};

module.exports = {
  getAvailableBookingsByRoom,
  getAvailableBookingsByRoomDescription
};
