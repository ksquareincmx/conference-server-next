const errorFactory = {
  cannotOverlap: roomName => ({
    status: 422,
    message: `There is already an appointment on ${roomName || "that room"}`
  }),
  cannotScheduleForYesterday: () => ({
    status: 422,
    message: "Cannot schedule room in the past"
  }),
  cannotScheduleOutsideOfficeHours: workingHours => ({
    status: 422,
    message: `Cannot schedule outside office hours from ${workingHours[0].from}-${workingHours[0].to}`
  }),
  wrongStartTime: () => ({
    status: 422,
    message: "Wrong start and end time"
  })
};

module.exports = { errorFactory };
