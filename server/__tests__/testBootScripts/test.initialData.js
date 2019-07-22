module.exports = async App => {
  const { Room, Booking, user, AccessToken } = App.models;

  const timeMaker = (minutes = 1, initialDate) => {
    initialDate = initialDate || Date.now();
    return initialDate + 1000 * 60 * minutes;
  };

  const [Room1, Room2] = await Room.create([
    {
      name: "WhiteText",
      bg_color: "#000",
      txt_color: "#FFF"
    },
    {
      name: "RedRum",
      bg_color: "#ff0000",
      txt_color: "#FFF"
    }
  ]);

  const [User1, User2] = await user.create([
    {
      email: "foo@gmail.com",
      name: "Foo González",
      password: "HAHA"
    },
    {
      email: "bar@gmail.com",
      name: "Bar Ruano",
      password: "HEHE"
    }
  ]);

  AccessToken.create([
    {
      id: "USER_1",
      user_id: User1.id
    }
  ]);

  Booking.create([
    {
      description: "Say Hello",
      start: timeMaker(30),
      end: timeMaker(60),
      room_id: Room1.id,
      user_id: User1.id,
      attendees: ["martiuh@gmail.com"]
    },
    {
      description: "Say GoodBye",
      start: timeMaker(120),
      end: timeMaker(155),
      user_id: User2.id,
      room_id: Room1.id
    },
    {
      description: "Stand Still",
      start: timeMaker(200),
      end: timeMaker(230),
      room_id: Room2.id,
      user_id: User1.id
    }
  ]);
};
