"use strict";

const qs = require("qs");
const calendarService = require("../../../services/calendarService/index.js");
const {
  slackService
} = require("../../../services/slackService/slackService.js");

const { getActualDate } = require("../../../utils.js");

function slackCommand(Booking) {
  return async function(req, res) {
    // We need to respond first so Slack have a confirmation. Otherwise, Slack will respond with a timeout error
    res.send("");
    const bodyJson = qs.parse(req.body.toString());
    const { response_url } = bodyJson;

    const { text } = bodyJson;
    const [bookingService, id] = text.split(" ");
    try {
      if (bookingService === "delete") {
        const booking = await Booking.findById(parseInt(id));

        if (!booking) {
          return await slackService.sendMessage({
            type: "error",
            toURL: response_url,
            text: "Booking not found"
          });
        }

        const parsedBooking = booking.toJSON();
        if (parsedBooking.end < getActualDate()) {
          return await slackService.sendMessage({
            type: "error",
            toURL: response_url,
            text: "Can't cancel a past appointment"
          });
        }

        await Promise.all([
          calendarService.deleteEvent(booking.eventId),
          Booking.destroyById(id)
        ]);

        return await slackService.sendMessage({
          type: "success",
          toURL: response_url,
          text: `Booking with id: ${id} deleted`
        });
      }

      const { trigger_id } = bodyJson;
      const { Room } = Booking.app.models;
      return await slackService.openDialog({
        trigger_id,
        dialogParams: {
          type: "select-room-and-date"
        },
        Room
      });
    } catch (error) {
      const { message } = error;
      return slackService.sendMessage({
        toURL: response_url,
        type: "error",
        text: message
      });
    }
  };
}

slackCommand.config = {
  http: {
    verb: "POST",
    path: "/slack/command"
  },
  accepts: [
    {
      arg: "req",
      type: "object",
      root: true,
      http: {
        source: "req"
      }
    },
    {
      arg: "res",
      type: "object",
      root: true,
      http: {
        source: "res"
      }
    }
  ]
};

module.exports = slackCommand;
