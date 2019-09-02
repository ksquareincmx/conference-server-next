const moment = require("moment-timezone");
const roomMapper = require("../mappers/RoomMapper");

class SlackMessageBuilder {
  constructor() {}
  // Default values should be optional
  async dialog({ Room, type, defaultValues }) {
    const rooms = await Room.find();
    const parsedRooms = rooms.map(roomMapper.toJSON);
    const roomsFormated = roomMapper.toSlackFormat(parsedRooms);
    if (type === "select-room-and-date") {
      return this.dialogForDateAndRoom(roomsFormated);
    }
    return this.dialogForAppointment(roomsFormated, defaultValues);
  }

  // Array of formated rooms
  dialogForDateAndRoom(roomsFormated) {
    const today = moment()
      .tz("America/Mexico_city")
      .format("YYYY-MM-DD");

    return JSON.stringify({
      title: "New Appointment",
      callback_id: "select-date-and-room",
      submit_label: "Submit",
      elements: [
        {
          label: "Appointment Date",
          type: "text",
          name: "date",
          value: today,
          hint: "Date format: yyyy-mm-dd."
        },
        {
          label: "Conference Room",
          type: "select",
          name: "roomId",
          placeholder: "DeWitt, Skywalker, ...",
          options: roomsFormated
        }
      ]
    });
  }

  // Put the correct interface
  dialogForAppointment(roomsFormated, defaultValues) {
    const { date, room } = defaultValues;
    const { id: roomId, name: roomName } = room;
    return JSON.stringify({
      title: "New Appointment",
      callback_id: "submit-booking",
      submit_label: "Submit",
      elements: [
        {
          label: "Appointment Date",
          type: "text",
          name: "date",
          value: date,
          hint: "Date format: yyyy-mm-dd."
        },
        {
          label: "Start Hour",
          type: "select",
          name: "startHour",
          value: "Choose an hour",
          options: [
            { label: "08", value: "08" },
            { label: "09", value: "09" },
            { label: "10", value: "10" },
            { label: "11", value: "11" },
            { label: "12", value: "12" },
            { label: "13", value: "13" },
            { label: "14", value: "14" },
            { label: "15", value: "15" },
            { label: "16", value: "16" },
            { label: "17", value: "17" },
            { label: "18", value: "18" }
          ]
        },
        {
          label: "Star Minute",
          type: "select",
          name: "startMinute",
          value: "Choose a minute",
          options: [
            { label: "00", value: "00" },
            { label: "15", value: "15" },
            { label: "30", value: "30" },
            { label: "45", value: "45" }
          ]
        },
        {
          label: "End Hour",
          type: "select",
          name: "endHour",
          value: "Choose an hour",
          options: [
            { label: "08", value: "08" },
            { label: "09", value: "09" },
            { label: "10", value: "10" },
            { label: "11", value: "11" },
            { label: "12", value: "12" },
            { label: "13", value: "13" },
            { label: "14", value: "14" },
            { label: "15", value: "15" },
            { label: "16", value: "16" },
            { label: "17", value: "17" },
            { label: "18", value: "18" }
          ]
        },
        {
          label: "End Minute",
          type: "select",
          name: "endMinute",
          value: "Choose a minute",
          options: [
            { label: "00", value: "00" },
            { label: "15", value: "15" },
            { label: "30", value: "30" },
            { label: "45", value: "45" }
          ]
        },
        {
          label: "Conference Room",
          type: "select",
          name: "roomId",
          value: roomId,
          placeholder: roomName,
          options: roomsFormated
        },
        {
          label: "Appointment Reason",
          type: "textarea",
          name: "description"
        },
        {
          label: "Invite people",
          type: "textarea",
          name: "attendees",
          optional: true,
          hint:
            "Please separete the emails with a dash, without space after it."
        }
      ]
    });
  }

  // Available hours is an array
  buildDialogConfirmation(date, room, availableHours) {
    const { id: roomId, name: roomName } = room;

    return {
      text: "New Booking!",
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            emoji: true,
            text: "Is the date and room correct? :smile:"
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Date:* ${date}\n*Room:* ${roomName}`
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            emoji: true,
            text: "This are the available hours: "
          }
        },
        {
          type: "section",
          fields: availableHours.map(hour => {
            return {
              type: "mrkdwn",
              text: `*From:* ${hour.start} - *To*: ${hour.end}`
            };
          })
        },
        {
          type: "actions",
          block_id: "appointment-date-room-confirmation",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: "Confirm room :+1:"
              },
              style: "primary",
              value: `${date}_${roomId}_${roomName}`
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                emoji: true,
                text: "Change room :-1:"
              },
              style: "danger",
              value: "retry"
            }
          ]
        }
      ],
      replace_original: false
    };
  }

  // atendees si an array of strings
  buildAppointmentConfirmation(bookingInfo) {
    const {
      slackUserName,
      startDate,
      endDate,
      location,
      description,
      attendees
    } = bookingInfo;

    const formatedStartDate = moment(startDate)
      .tz("America/Mexico_city")
      .format("dddd, MMMM Do YYYY, k:mm");
    const formatedEndDate = moment(endDate)
      .tz("America/Mexico_city")
      .format("k:mm a");

    return {
      text: "New Booking!",
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            emoji: true,
            text: "Looks like you have schedule a new appointment! :smile:"
          }
        },
        {
          type: "divider"
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*User:* ${slackUserName}`
            },
            {
              type: "mrkdwn",
              text: `*Room:* ${location}`
            },
            {
              type: "mrkdwn",
              text: `*Date:* ${formatedStartDate}-${formatedEndDate}`
            },
            {
              type: "mrkdwn",
              text: `*Reason:* ${description}`
            },
            {
              type: "mrkdwn",
              text: `*Attendees:* ${attendees.length}`
            }
          ],
          accessory: {
            type: "image",
            image_url:
              "https://api.slack.com/img/blocks/bkb_template_images/notifications.png",
            alt_text: "calendar thumbnail"
          }
        }
      ],
      replace_original: false
    };
  }

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

module.exports = { slackMessageBuilder: new SlackMessageBuilder() };
