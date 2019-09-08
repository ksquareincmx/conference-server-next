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

        // USER IS NOT DEFINED
        await user.create({
          name: slackUser.real_name,
          email: slackUser.email
        });

        const attendees = bookingInfo.attendees
          ? [...bookingInfo.attendees.split(","), email]
          : [email];

        const uniqueEmails = [...new Set(attendees)];
        const { description } = bookingInfo;

        const eventCalendar = await calendarService.insertEvent(
          startDate,
          endDate,
          description,
          uniqueEmails,
          location
        );

        // insert booking the DB
        const data = {
          userId,
          roomId,
          description,
          uniqueEmails,
          start: startDate,
          end: endDate
        };

        // await Booking.create({
        //   description: "1st booking",
        //   end: moment().add("30", "minutes"),
        //   start: moment().add("10", "minutes"),
        //   user_id: FirstUser.id,
        //   room_id: rooomsArr[0].id
        // });

        const bookingDao = await this.model.create({
          ...data,
          eventId: eventCalendar.id
        });

        // get the created booking with room and user details
        const createdBooking = await Booking.findById(bookingDao.id, {
          include: [Room, User]
        });
        const parsedBooking = createdBooking.toJSON();

        // insert attendee in the DB
        uniqueEmails.forEach(async attendee => {
          const attendeeId = await insertAttendee(attendee);
          await insertBookingAttendee(parsedBooking.id, attendeeId);
        });

        return {
          startDate,
          endDate,
          location,
          description,
          attendees: uniqueEmails
        };
      } catch (error) {
        const { message } = error;
        return Promise.reject(new Error(message));
      }
    };

    const getAvailableHoursForBooking = async ({ date, roomId }) => {
      const isValidDate = date => date.toString() !== "Invalid date";
      try {
        if (!isEmpty(date) && !isValidDate(date)) {
          return Promise.reject(
            new Error("Date must be a date in format YYYY-MM-DD")
          );
        }

        const Room = req.app.models.Room;
        const room = await Room.findById(roomId);
        if (!room) {
          return Promise.reject(new Error(`Room ${roomId} doesn't exist.`));
        }

        const bookings = await Booking.findAll({
          where: {
            roomId,
            start: {
              [Op.gte]: `${date}T08:00:00`,
              [Op.lte]: `${date}T23:00:00`
            }
          }
        });

        // Get hours when the conference room is reserved
        const getBookingHours = booking => {
          const parsedBooking = booking.toJSON();

          // Convert from UTC to local time
          const localStartDate = moment(parsedBooking.start)
            .tz("America/Mexico_city")
            .format();
          const localEndDate = moment(parsedBooking.end)
            .tz("America/Mexico_city")
            .format();

          return {
            start: localStartDate.slice(11, 16),
            end: localEndDate.slice(11, 16)
          };
        };

        const occupiedHours = _.chain(bookings)
          .map(getBookingHours)
          .sortBy("start")
          .value();

        // Add to occupiedHours edge Hours
        occupiedHours.unshift({ start: "00:00", end: "08:00" });
        occupiedHours.push({ start: "18:00", end: "23:59" });

        // Get hours when the conference room is free
        const freeHours = _.chain(occupiedHours)
          .map((hour, i, arr) => {
            if (i < arr.length - 1) {
              return hour.end !== arr[i + 1].start
                ? { start: hour.end, end: arr[i + 1].start }
                : null;
            }
          })
          .filter()
          .value();

        return freeHours;
      } catch (error) {
        const { message } = error;
        return Promise.reject(new Error(message));
      }
    };

    const bookingsPlusAttendees = async bookings => {
      // Add attendees to booking
      try {
        const bookingsWithAttendees = bookings.map(async booking => {
          const attendees = await getAttendees(booking.id);
          const bookingWithAttendees = {
            ...booking,
            attendees: attendees.map(attendee => attendee.email)
          };
          return bookingWithAttendees;
        });

        const finalBookings = await Promise.all(bookingsWithAttendees);
        return finalBookings;
      } catch (err) {
        throw err;
      }
    };

    const destroyBooking = async (req, res) => {
      const data = {
        params: req.params
      };

      try {
        const booking = await this.model.findById(data.params.id);

        if (!booking) {
          return Controller.notFound(res);
        }

        const parsedBooking = booking.toJSON();
        if (parsedBooking.end < getActualDate()) {
          return res
            .status(409)
            .send({ code: 409, message: "Cannot cancel a past meeting" });
        }

        await calendarService.deleteEvent(booking.eventId);
        this.destroy(req, res);
      } catch (err) {
        return Controller.serverError(res);
      }
    };

    const createBooking = async (req, res) => {
      const data = createBookingMapper.toEntity(req.body);

      if (!isAvailableDate(data.start, data.end)) {
        return Controller.badRequest(
          res,
          "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
        );
      }

      // remove duplicate emails
      data.attendees.push(req.session.user.email);
      const uniqueEmails = [...new Set(data.attendees)];

      try {
        const room = await Room.findOne({
          attributes: ["id", "name"],
          where: { id: data.roomId }
        });

        if (!room) {
          return Controller.badRequest(
            res,
            `Bad Request: room ${data.roomId} not exist.`
          );
        }

        const { name: location } = room.toJSON();

        const booking = await bookingDataStorage.findCollisions(data);

        //if exist a booking that overlaps whit start and end
        if (booking) {
          return Controller.noContent(res);
        }

        // TODO: Refactor and do transaction of the code below
        // insert event in Google calendar and send invitations
        const eventCalendar = await calendarService.insertEvent(
          data.start,
          data.end,
          data.description,
          uniqueEmails,
          location
        );

        // insert booking the DB
        const bookingDao = await this.model.create({
          ...data,
          eventId: eventCalendar.id
        });

        // get the created booking with room and user details
        const createdBooking = await Booking.findById(bookingDao.id, {
          include: [Room, User]
        });
        const parsedBooking = createdBooking.toJSON();

        // insert attendee in the DB
        uniqueEmails.forEach(async attendee => {
          const attendeeId = await insertAttendee(attendee);
          await insertBookingAttendee(parsedBooking.id, attendeeId);
        });

        // remove sensible data from user
        const finalBooking = {
          ...fp.omit("user", parsedBooking),
          user: {
            ...fp.omit(["password", "role"], parsedBooking.user)
          },
          attendees: uniqueEmails
        };

        const DTOBooking = bookingMapper.toDTO(finalBooking);
        res.status(201).json(DTOBooking);
      } catch (err) {
        return Controller.serverError(res, err);
      }
    };

    const updateBooking = async (req, res) => {
      const data = updateBookingMapper.toEntity({
        params: req.params,
        body: req.body
      });

      if (!isAvailableDate(data.body.start, data.body.end)) {
        return Controller.badRequest(
          res,
          "bad Request: The booking only can have office hours (Monday-Friday, 8AM-6PM)."
        );
      }

      // remove duplicate emails
      data.body.attendees.push(req.session.user.email);
      const uniqueEmails = [...new Set(data.body.attendees)];

      try {
        const room = await Room.findOne({
          attributes: ["id", "name"],
          where: { id: data.body.roomId }
        });

        if (!room) {
          return Controller.badRequest(
            res,
            `Bad Request: room ${data.body.roomId} doesn't exist.`
          );
        }

        const { name: location } = room.toJSON();

        const bookings = await bookingDataStorage.findUpdatedCollisions({
          ...data.body,
          ...data.params
        });

        // if exist a booking that overlaps whit start and end
        if (bookings) {
          return Controller.noContent(res);
        }

        const booking = await this.model.findById(data.params.id);
        if (!booking) {
          return res.status(404).end();
        }

        // TODO: transsaction
        // update the event and send emails
        await calendarService.updateEvent(
          booking.eventId,
          data.body.start,
          data.body.end,
          data.body.description,
          uniqueEmails,
          location
        );

        // update tables: attende and bookingAttende
        const updatedAttendees = await updateBookingAttendee(
          data.params.id,
          uniqueEmails
        );
        const bookingDao = await booking.update({
          ...data.params,
          ...data.body
        });

        const updatedBooking = await Booking.findById(bookingDao.id, {
          include: [Room, User]
        });
        const parsedBooking = updatedBooking.toJSON();

        // remove sensible data from user
        const finalUpdatedBooking = {
          ...fp.omit("user", parsedBooking),
          user: {
            ...fp.omit(["password", "role"], parsedBooking.user)
          },
          attendees: updatedAttendees
        };
        const DTOBooking = bookingMapper.toDTO(finalUpdatedBooking);
        res.status(200).json(DTOBooking);
      } catch (err) {
        return Controller.serverError(res, err);
      }
    };

    const findOneBooking = async (req, res) => {
      const data = {
        params: req.params
      };

      try {
        const booking = await this.model.findById(data.params.id, {
          include: [Room, User]
        });
        if (!booking) {
          return Controller.notFound(res);
        }

        const parsedBooking = booking.toJSON();
        const attendees = await getAttendees(data.params.id);

        const finalBooking = {
          ...parsedBooking,
          attendees: attendees.map(attende => attende.email)
        };

        //interface
        const DTOBooking = bookingMapper.toDTO(finalBooking);
        res.status(200).json(DTOBooking);
      } catch (err) {
        Controller.serverError(res, err);
      }
    };

    const findBookingsService = async (req, res) => {
      const data = {
        query: req.query
      };

      try {
        const { bookings, rows } = await bookingDataStorage.findAll(data.query);
        const DTOBookings = bookings.map(bookingMapper.toDTO);

        // Add pagination metadata
        const page = Number(data.query.page || 1);
        const size = Number(data.query.pageSize || config.api.limit);
        const pagination = {
          size,
          prev: page - 1 || null,
          next: page * size >= rows ? null : page + 1
        };

        return res
          .status(200)
          .json({ _pagination: pagination, bookings: DTOBookings });
      } catch (err) {
        return Controller.serverError(res, err);
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
