const moment = require("moment-timezone");

module.exports = async App => {
  const { user, Booking, Room } = App.models;

  const FirstUser = await user.create({
    name: "Totally not Masiosare",
    email: "anstrangeenemy@ksquareinc.com",
    password: "password",
    role: "admin"
  });

  const rooomsArr = await Room.create([
    {
      name: "DeWitt",
      bg_color: "#FFFF",
      txt_color: "#0000"
    },
    {
      name: "Skywalker",
      bg_color: "#FFFF",
      txt_color: "#0000"
    },
    {
      name: "Ganondorf",
      bg_color: "#FFFF",
      txt_color: "#0000"
    },
    {
      name: "Stark",
      bg_color: "#FFFF",
      txt_color: "#0000"
    },
    {
      name: "Dumbledore",
      bg_color: "#FFFF",
      txt_color: "#0000"
    },
    {
      name: "Wayne",
      bg_color: "#FFFF",
      txt_color: "#0000"
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
