// const { Router } = require("express");
// const { isEmpty, getActualDate, isWeekendDay } = require("../utils");
// const { log } = require("../libraries/log");
// const {
//   auth: {
//     slack: { appPath: slackPath }
//   }
// } = require("../config.local");
// const { slackService } = require("../services/slackService/slackService");
// const fetch = require("node-fetch");
// const slackInitialBefore = Router();
// const bodyParser = require("body-parser");
// const { URLSearchParams } = require("url");
// const uuidv4 = require("uuid/v4");

// slackInitialBefore.use(bodyParser.urlencoded({ extended: false }));

// // Middleware for validating each request
// slackInitialBefore.use((req, res, next) => {
//   const { url } = req;

//   // Oauth request dont need to be validated
//   if (url.indexOf("/oauth20") === 0) {
//     next();
//     return;
//   }

//   const { response_url } = req.body;
//   if (slackService.slackService.validateSignature(req)) {
//     slackService.sendMessage({
//       toURL: response_url,
//       type: "error",
//       text: "Request is not signed correctly"
//     });
//     res.status(200).send("Waiting for confirmation"); // Slack needs always a 200
//   } else {
//     res.status(200).send("Waiting for confirmation"); // Every request should have a 200
//     next();
//   }
// });

// slackInitialBefore.post("/command", async (req, res) => {
//   const { Booking } = req.app.models;

//   const { response_url } = req.body;

//   const { text } = req.body;
//   const [bookingService, id] = text.split(" ");

//   try {
//     if (!bookingService === "delete") {
//       const booking = await Booking.findById(parseInt(id));

//       if (!booking) {
//         return await slackService.sendMessage({
//           type: "error",
//           toURL: response_url,
//           text: "Booking not found"
//         });
//       }

//       if (booking.end < getActualDate()) {
//         return await slackService.sendMessage({
//           type: "error",
//           toURL: response_url,
//           text: "Can't cancel a past appointment"
//         });
//       }

//       await Booking.destroyById(id);

//       return await slackService.sendMessage({
//         type: "success",
//         toURL: response_url,
//         text: `Booking with id: ${id} deleted`
//       });
//     }

//     const { trigger_id } = req.body;
//     return await slackService.openDialog({
//       trigger_id,
//       dialogParams: {
//         type: "select-room-and-date"
//       }
//     });
//   } catch (error) {
//     const { message } = error;
//     return slackService.sendMessage({
//       toURL: response_url,
//       type: "error",
//       text: message
//     });
//   }
// });

// slackInitialBefore.post("/interaction", async (req, res) => {
//   const payload = JSON.parse(req.body.payload);
//   const { type } = payload;
//   const { Room } = req.app.models;

//   try {
//     switch (type) {
//       case "dialog_submission":
//         const { callback_id, submission } = payload;
//         if (callback_id === "select-date-and-room") {
//           const { date, roomId } = submission;

//           if (isWeekendDay(date)) {
//             return res.json({
//               errors: [
//                 {
//                   name: "date",
//                   error: "You can only book a room within office hours"
//                 }
//               ]
//             });
//           }

//           // This closes the dialog in Slack

//           const availableHours = await Room.getAvailableBookingsByRoom(
//             date,
//             roomId
//           );
//           const currentRoom = await Room.findById(roomId);

//           const responseContent = {
//             date,
//             availableHours,
//             room: currentRoom
//           };

//           return await slackService.sendDialog;
//         }
//         break;

//       default:
//         break;
//     }
//   } catch (error) {
//     log.error(`Error in slackRouter.js`, error);
//   }
// });

// slackInitialBefore.get("/oauth20", async (req, res) => {});

// module.exports = () => slackInitialBefore;
