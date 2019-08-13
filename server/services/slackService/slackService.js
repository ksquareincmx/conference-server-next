const fetch = require("node-fetch");
const { builder } = require("../../libraries/slackMessageBuilder");
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

  async openDialog({ trigger_id, dialogParams }) {
    const dialog = await builder.dialog(dialogParams);
    const interactiveDialog = {
      trigger_id,
      dialog
    };
  }

  async sendMessage({ type, toURL, text }) {
    const message = builder.message({ type, text });
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

  validateSignature(req) {

    const signature = req.headers["x-slack-signature"];
    const timestamp = req.headers["x-slack-request-timestamp"];
    const hmac = crypto.createHmac("sha256", slack.signingSecret);
    const [version, hash] = signature.split("=");

    // Check if the timestamp is too old
    const fiveMinutesAgo = ~~(Date.now() / 1000) - 60 * 5;
    if (timestamp < fiveMinutesAgo) return false;

    hmac.update(`${version}:${timestamp}:${req.body.toString()}`);

    // check that the request signature matches expected value
    return timingSafeCompare(hmac.digest("hex"), hash);

  }

  async sendDialogSubmitResponse(toURL, responseContent) {
    const isBookingSubmition = content => {
      console.log({ content });
      return content.slackUserName != undefined;
    };
  }



}

module.exports = { slackService: new SlackService() };
