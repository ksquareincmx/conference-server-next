"use strict";

const fetch = require("node-fetch");
const moment = require("moment-timezone");
const { areIntervalsOverlapping } = require("date-fns");

const {
  slackService
} = require("../../../services/slackService/slackService.js");
const {
  isWeekendDay,
  isEmpty,
  formatDateFromSlack,
  isAvailableDate
} = require("../../../utils.js");

function slackInteraction(Booking) {
  return async function(req, res) {
    const manageInteraction = async () => {
      const payload = JSON.parse(req.body.payload);
      const { response_url } = payload;

      const { type } = payload;
      try {
        switch (type) {
          case "dialog_submission":
            const { callback_id, submission } = payload;
            if (callback_id === "select-date-and-room") {
              const { date, roomId } = submission;

              if (isWeekendDay(date)) {
                return res.status(200).json({
                  errors: [
                    {
                      name: "date",
                      error: "Can't do an appointment on weekends!"
                    }
                  ]
                });
              }

              // This closes the dialog in slack
              res.send("");
              const Room = req.app.models.Room;
              const availableHours = await Room.getAvailableBookingsByRoom(
                parseInt(roomId),
                date
              );

              const roomFounded = await Room.findById(roomId);

              const responseContent = {
                date,
                availableHours,
                room: roomFounded.toJSON()
              };

              return await slackService.sendDialogSubmitResponse({
                toURL: response_url,
                responseContent
              });
            }

            const { isValid, errors } = validateBooking(submission);
            if (!isValid) {
              return res.json({ errors });
            }

            res.send("");

            const { user } = payload;
            const createdBooking = await createBookingFromSlack({
              bookingInfo: submission
            });

            const { name: slackUserName } = user;
            const responseContent = {
              slackUserName,
              ...createdBooking
            };
            return await slackService.sendDialogSubmitResponse({
              toURL: response_url,
              responseContent
            });

          case "block_actions":
            res.send("");
            const { actions, trigger_id } = payload;
            const [action] = actions;
            const { value } = action;
            const Room = req.app.models.Room;

            if (value === "retry") {
              return await slackService.openDialog({
                trigger_id,
                dialogParams: {
                  type: "select-room-and-date"
                },
                Room
              });
            }
            const [date, id, name] = value.split("_");
            const defaultValues = {
              date,
              room: {
                id,
                name
              }
            };
            return await slackService.openDialog({
              trigger_id,
              dialogParams: {
                defaultValues,
                type: "new-appointment"
              },
              Room
            });
        }
      } catch (error) {
        const { message } = error;
        return slackService.sendMessage({
          toURL: response_url,
          type: "error",
          text: message
        });
      }
    };

    const validateBooking = bookingInfo => {
      const { startDate, endDate } = formatDateFromSlack(bookingInfo);

      if (startDate === endDate) {
        return {
          isValid: false,
          errors: [
            {
              name: "startHour",
              error: "The appointment hours are the same!"
            },
            {
              name: "startMinute",
              error: "The appointment hours are the same!"
            },
            {
              name: "endHour",
              error: "The appointment hours are the same!"
            },
            {
              name: "endMinute",
              error: "The appointment hours are the same!"
            }
          ]
        };
      }

      if (!isAvailableDate(startDate, endDate)) {
        return {
          isValid: false,
          errors: [
            {
              name: "endHour",
              error:
                "The booking only can have office hours (Monday-Friday, 8AM-6PM)."
            },
            {
              name: "endMinute",
              error:
                "The booking only can have office hours (Monday-Friday, 8AM-6PM)."
            }
          ]
        };
      }

      const { description } = bookingInfo;
      if (!description) {
        return {
          isValid: false,
          errors: [
            {
              name: "description",
              error: "Please write some appointment description"
            }
          ]
        };
      }

      return { isValid: true, errors: [] };
    };

    const createBookingFromSlack = async ({ bookingInfo }) => {
      const { startDate, endDate } = formatDateFromSlack(bookingInfo);

      try {
        const {
          officeConfig: { workingHours }
        } = req.app;

        const Room = req.app.models.Room;
        const { roomId } = bookingInfo;
        const room = await Room.findById(parseInt(roomId));

        if (!room) {
          return Promise.reject(
            new Error(`Room ${bookingInfo.roomId} doesn't exist.`)
          );
        }

        const { date } = bookingInfo;

        // Getting bookings through the relation with bookings
        const roomBookings = await room.bookings.find({
          where: {
            start: {
              between: [
                `${date}T${workingHours[0].from}:00`,
                `${date}T${workingHours[0].to}:00`
              ]
            }
          }
        });

        const startAp = `${date}T${bookingInfo.startHour}:${bookingInfo.startMinute}:00`;
        const endAp = `${date}T${bookingInfo.endHour}:${bookingInfo.endMinute}:00`;

        // compares if the bookings collide with the user current booking
        let booking = false;
        roomBookings.forEach(bkg => {
          const overlap = areIntervalsOverlapping(
            { start: new Date(bkg.start), end: new Date(bkg.end) },
            { start: new Date(startAp), end: new Date(endAp) }
          );

          if (overlap) booking = true;
        });

        const { name: location } = room.toJSON();

        // if exist a booking that overlaps whit start and end
        if (booking) {
          return Promise.reject(
            new Error(`There is a appointment overlaping in ${location}`)
          );
        }

        // Trying to kill the fricking Masiosare

        const payload = JSON.parse(req.body.payload);
        const url = `https://slack.com/api/users.info?token=${process.env.SLACK_ACCESS_TOKEN}&user=${payload.user.id}`;
        const response = await fetch(url, { method: "GET" });
        const slackData = await response.json();

        if (!slackData.user.profile) {
          return Promise.reject(new Error("User doesn't exist."));
        }

        const slackUser = slackData.user.profile;

        const user = req.app.models.user;
        const newUser = await user.create({
          name: slackUser.real_name,
          email: slackUser.email
        });

        const attendees = bookingInfo.attendees
          ? [...bookingInfo.attendees.split(","), slackUser.email]
          : [slackUser.email];

        const uniqueEmails = [...new Set(attendees)];

        const newBooking = await Booking.create({
          description: bookingInfo.description,
          end: endDate,
          start: startDate,
          user_id: newUser.id,
          room_id: bookingInfo.roomId,
          attendees: uniqueEmails,
          location
        });

        newBooking.location = location;
        // newBooking.slackUserName = slackData.user.name;

        return newBooking;
      } catch (error) {
        const { message } = error;
        return Promise.reject(new Error(message));
      }
    };

    return {
      manageInteraction: manageInteraction()
    };
  };
}

slackInteraction.config = {
  http: {
    verb: "POST",
    path: "/slack/interaction"
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

module.exports = slackInteraction;
