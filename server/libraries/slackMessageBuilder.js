class SlackMessageBuilder {
  constructor() {}
  message({ type, text: messageText }) {
    const image_url =
      type === "success"
        ? "https://api.slack.com/img/blocks/bkb_template_images/notifications.png"
        : "https://api.slack.com/img/blocks/bkb_template_images/notificationsWarningIcon.png";
    return {
      blocks: [
        {
          type: "context",
          elements: [
            {
              image_url,
              type: "image",
              alt_text: "message icon"
            },
            {
              type: "mrkdwn",
              text: `*${messageText}*`
            }
          ]
        }
      ]
    };
  }
}
