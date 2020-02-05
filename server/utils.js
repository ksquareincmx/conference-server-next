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
  }
};

// TODO: soon to be erased.