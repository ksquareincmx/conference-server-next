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