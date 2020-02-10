const moment = require("moment-timezone");

function getActualDate() {
    return moment()
      .utc()
      .format();
  }

module.exports = getActualDate;