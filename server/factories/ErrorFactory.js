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
  }),
  badRequest: (message = 'Bad request') => {
    const e = new Error(message);
    e.statusCode = 400;
    return e;
  },
  unauthorized: (message = 'Unauthorized') => {
    const e = new Error(message);
    e.statusCode = 401;
    return e;
  },
  forbidden: (message = 'Forbidden') => {
    const e = new Error(message);
    e.statusCode = 401;
    return e;
  },
  serverError: (message = 'Internal server error') => {
    const e = new Error(message);
    e.statusCode = 401;
    return e;
  }
};

module.exports = { errorFactory };
