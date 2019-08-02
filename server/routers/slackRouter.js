const { Router } = require("express");
const { isEmpty, getActualDate, isWeekendDay } = require("../utils");
const { log } = require("../libraries/log");
const { restApiRoot } = require("../config.local");
const {
  config: { auth }
} = require("../config/config");
const { slackService } = require("../services/slackService");

const slackRouter = Router();
const slackURL = `${restApiRoot}/slack/`;

// Middleware for validating each request
slackRouter.use((req, res, next) => {
  const { response_url } = req.body;
  if (slackService.validateSignature(req)) {
    slackService.sendMessage({
      toURL: response_url,
      type: "error",
      text: "Request is not signed correctly"
    });
    res.sendStatus(200); // Slack needs always a 200
  } else {
    res.sendStatus(200); // Every request should have a 200
    next();
  }
});

slackRouter.post("/command", async (req, res) => {
  const { Booking } = req.app.models;

  const { response_url } = req.body;

  const { text } = req.body;
  const [bookingService, id] = text.split(" ");

  try {
    if (!bookingService === "delete") {
      const booking = await Booking.findById(parseInt(id));

      if (!booking) {
        return await slackService.sendMessage({
          type: "error",
          toURL: response_url,
          text: "Booking not found"
        });
      }

      if (booking.end < getActualDate()) {
        return await slackService.sendMessage({
          type: "error",
          toURL: response_url,
          text: "Can't cancel a past appointment"
        });
      }

      await Booking.destroyById(id);

      return await slackService.sendMessage({
        type: "success",
        toURL: response_url,
        text: `Booking with id: ${id} deleted`
      });
    }

    const { trigger_id } = req.body;
    return await slackService.openDialog({
      trigger_id,
      dialogParams: {
        type: "select-room-and-date"
      }
    });
  } catch (error) {
    const { message } = error;
    return slackService.sendMessage({
      toURL: response_url,
      type: "error",
      text: message
    });
  }
});

slackRouter.post("/interaction", async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  const { type } = payload;
  const { Room } = req.app.models;

  try {
    switch (type) {
      case "dialog_submission":
        const { callback_id, submission } = payload;
        if (callback_id === "select-date-and-room") {
          const { date, roomId } = submission;

          if (isWeekendDay(date)) {
            return res.json({
              errors: [
                {
                  name: "date",
                  error: "You can only book a room within office hours"
                }
              ]
            });
          }

          // This closes the dialog in Slack

          const availableHours = await Room.getAvailableBookingsByRoom(
            date,
            roomId
          );
          const currentRoom = await Room.findById(roomId);

          const responseContent = {
            date,
            availableHours,
            room: currentRoom
          };

          return await slackService.sendDialog;
        }
        break;

      default:
        break;
    }
  } catch (error) {
    log.error(`Error in slackRouter.js`, error);
  }
});

module.exports = {
  slackRouter
};
