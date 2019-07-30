errorFactory = {
  cannotOverlap: roomName => ({
    status: 422,
    message: `There is already an appointment on ${roomName || "that room"}`
  }),
  cannotScheduleForYesterday: () => ({
    status: 422,
    message: "Cannot schedule room in the past"
  }),
  cannotScheduleOutsideOfficeHours: () => ({
    status: 422,
    message: `Cannot schedule outside office hours from ${officeHours.workingHours[0].from}-${officeHours.workingHours[0].to}`
  })
};

module.exports = { errorFactory };
