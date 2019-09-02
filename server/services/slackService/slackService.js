const fetch = require("node-fetch");
const qs = require("qs");
const {
  slackMessageBuilder
} = require("../../libraries/slackMessageBuilder.js");
const {
  config: {
    auth: { slack }
  }
} = require("../../config/config");
const crypto = require("crypto");
const timingSafeCompare = require("tsscmp");

class SlackService {
  constructor() {
    this.slackApiUri = process.env.SLACK_API_URI;
    this.accessToken = process.env.SLACK_ACCESS_TOKEN;
  }

  async openDialog({ trigger_id, dialogParams, Room }) {
    const dialog = await slackMessageBuilder.dialog({ Room, ...dialogParams });
    const interactiveDialog = {
      trigger_id,
      dialog
    };

    try {
      return await fetch(`${this.slackApiUri}/dialog.open`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(interactiveDialog)
      });
    } catch (error) {
      return Promise.reject(new Error(`dialog.open call failed: ${error}`));
    }
  }

  async sendMessage({ type, toURL, text }) {
    const message = slackMessageBuilder.message({ type, text });
    try {
      const res = await fetch(toURL, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(message)
      });
    } catch (error) {
      const { message } = error;
      return Promise.reject(new Error(`Message sending failed: ${message}`));
    }
  }

  // DEPRECATED
  validateSignature(req) {
    const signature = req.headers["x-slack-signature"];
    const timestamp = req.headers["x-slack-request-timestamp"];
    const hmac = crypto.createHmac("sha256", slack.signingSecret);
    const [version, hashToken] = signature.split("=");

    // Check if the timestamp is too old
    const fiveMinutesAgo = ~~(Date.now() / 1000) - 60 * 5;
    if (timestamp < fiveMinutesAgo) {
      return false;
    }

    const body = req.body.toString();

    hmac.update(`${version}:${timestamp}:${body}`);
    const hmacToken = hmac.digest("hex");

    // check that the request signature matches expected value
    return timingSafeCompare(hmacToken, hashToken);
  }

  async sendDialogSubmitResponse({ toURL, responseContent }) {
    const isAppointmentSubmission = content => {
      return content.slackUserName != undefined;
    };

    const { date, room, availableHours } = responseContent;

    const message = isAppointmentSubmission(responseContent)
      ? slackMessageBuilder.buildAppointmentConfirmation(responseContent)
      : slackMessageBuilder.buildDialogConfirmation(date, room, availableHours);

    try {
      return await fetch(toURL, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(message)
      });
    } catch (error) {
      return Promise.reject(new Error(`Submit dialog send failed: ${error}`));
    }
  }
}

module.exports = { slackService: new SlackService() };
