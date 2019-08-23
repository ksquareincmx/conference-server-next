"use strict";

async function slackCommand(Booking) {
  return async function(req, res) {
    res.send("Wait a little");

    // Slack commands logic comes here
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
