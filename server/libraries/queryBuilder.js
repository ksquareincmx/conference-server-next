module.exports = {
  queryBuilder: {
    booking: {
      isAlreadyBooked: (room_id, start, end) => ({
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
      })
    }
  }
};
