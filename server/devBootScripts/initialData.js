// const moment = require('moment');

// module.exports = App => {
//     const { Room, user, Booking } = App.models;
//     Room.create(
//       {
//         name: "Kijimi",
//         bg_color: "gray",
//         txt_color: "blue"
//       }, (err, kijimiRoom) => {
//         if (err) {
//           throw new Error(`Cannot create Room`, err);
//         }

//         user.create(
//             {
//                 name: "Babu Frik",
//                 role: "admin",
//             }, (err, babu) => {
//                 if (err) {
//                     throw new Error('Cannot create user', err);
//                 }

//             Booking.create(               
//                 {
//                     description: "He-hey!",
//                     start: moment().set( { hour: 10, minute: 15 } ).valueOf(),
//                     end: moment().set( { hour: 10, minute: 45 } ).valueOf(),
//                     room_id: kijimiRoom.id,
//                     user_id: babu.id
//                 }, (err, newBooking) => {
//                   if (err) {
//                     throw new Error('Cannot create booking', err);
//                   }
//                 }
//             )

//             }
//         )
//       }
//     );
//   };

const moment = require("moment-timezone");

module.exports = async App => {
  const { user, Booking, Room } = App.models;

  const FirstUser = await user.create({
    name: "Test User",
    email: "conferenceshenanigans@gmail.com",
    password: "password",
    role: "admin"
  });

  const rooomsArr = await Room.create([
    {
      name: "DeWitt",
      bg_color: "#333",
      txt_color: "#e3e3e3"
    },
    {
      name: "Skywalker",
      bg_color: "#333",
      txt_color: "#e3e3e3"
    },
    {
      name: "Ganondorf",
      bg_color: "#333",
      txt_color: "#e3e3e3"
    },
    {
      name: "Stark",
      bg_color: "#333",
      txt_color: "#e3e3e3"
    },
    {
      name: "Dumbledore",
      bg_color: "#333",
      txt_color: "#e3e3e3"
    },
    {
      name: "Wayne",
      bg_color: "#333",
      txt_color: "#e3e3e3"
    }
  ]);

  await Booking.create({
    description: "1st booking",
    end: moment().add("30", "minutes"),
    start: moment().add("10", "minutes"),
    user_id: FirstUser.id,
    room_id: rooomsArr[0].id
  });
};