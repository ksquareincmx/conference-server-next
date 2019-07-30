module.exports = {
  queryBuilder: {
    booking: {
      isAlreadyBooked: (roomId, start, end) => ({
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
