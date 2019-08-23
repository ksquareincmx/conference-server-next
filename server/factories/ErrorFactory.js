"use strict";

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
  notEnoughGuests: () => ({
    status: 422,
    message: "Not enough guests to book this room!"
  }),
  badRequest: errorWith.bind(null, "Bad request", 400),
  unauthorized: errorWith.bind(null, "Unauthorized", 401),
  forbidden: errorWith.bind(null, "Forbidden", 403),
  serverError: errorWith.bind(null, "Internal server error", 500)
};

function errorWith(message, statusCode, errorCode) {
  const e = new Error(message);
  e.statusCode = statusCode;
  e.errorCode = errorCode;
  return e;
}

module.exports = { errorFactory };
