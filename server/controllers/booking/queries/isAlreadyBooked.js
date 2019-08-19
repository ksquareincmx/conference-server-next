"use strict";

module.exports = (roomId, start, end) => ({
  where: {
    roomId,
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
});
