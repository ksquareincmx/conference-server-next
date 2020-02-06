const moment = require("moment-timezone");

function isWeekendDay(date) {
    const formattedDate = moment(`${date}T05:00`).tz("America/Mexico_city");
    const day = formattedDate.isoWeekday();
    return day === 6 || day === 7;
}

module.exports = isWeekendDay;