"use strict";

module.exports = (roomId, start, end) => ({
  where: {
    room_id: roomId,
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
