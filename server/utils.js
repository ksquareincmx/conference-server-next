const moment = require("moment-timezone");

module.exports = {
  isEmpty: attr => !attr && attr !== 0,
  getActualDate: () => {
    return moment()
      .utc()
      .format();
  },
  isWeekendDay: date => {
    const formattedDate = moment(`${date}T05:00`).tz("America/Mexico_city");
    const day = formattedDate.isoWeekday();
    return day === 6 || day === 7;
  },
  toSyntax: (obj, syntaxConverter) => {
    return Object.keys(obj).reduce(
      (acc, key) => ((acc[syntaxConverter(key)] = obj[key]), acc),
      {}
    );
  },
  isEmpty: attribute => {
    return !attribute && attribute !== 0;
  },
  formatDateFromSlack: ({
    date,
    startHour,
    startMinute,
    endHour,
    endMinute
  }) => {
    const hourOffset =
      moment()
        .tz("America/Mexico_city")
        .utcOffset() / 60;

    const startDate = moment(`${date}T${startHour}:${startMinute}`)
      .utcOffset(hourOffset, true)
      .utc()
      .format();

    const endDate = moment(`${date}T${endHour}:${endMinute}`)
      .utcOffset(hourOffset, true)
      .utc()
      .format();

    return { startDate, endDate };
  },
  isAvailableDate: (start, end, timezone = "America/Mexico_City") => {
    const startDate = moment(start).tz(timezone);
    const endDate = moment(end).tz(timezone);

    // Check if is weekday
    const isAvailableDay = day => !(day === 6 || day === 7);

    // Check if the hours is in office hours
    const isAvailableHour = (starHour, endHour) =>
      starHour >= "08:00" && endHour <= "18:00";

    return (
      isAvailableDay(startDate.isoWeekday()) &&
      isAvailableHour(startDate.format("HH:mm"), endDate.format("HH:mm"))
    );
  }
};
