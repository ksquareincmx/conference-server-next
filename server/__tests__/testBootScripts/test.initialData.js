module.exports = async App => {
  const { Room, Booking, user, AccessToken } = App.models;

  const timeMaker = (minutes = 1, initialDate) => {
    initialDate = initialDate || Date.now();
    return initialDate + 1000 * 60 * minutes;
  };

  const [Room1, Room2] = await Room.create([
    {
      name: "WhiteText",
      bgColor: "#000",
      txtColor: "#FFF"
    },
    {
      name: "RedRum",
      bgColor: "#ff0000",
      txtColor: "#FFF"
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
      userId: User1.id
    }
  ]);

  Booking.create([
    {
      description: "Say Hello",
      start: timeMaker(30),
      end: timeMaker(60),
      eventId: "falkdsjf0i12",
      roomId: Room1.id,
      attendees: ["martiuh@gmail.com"]
    },
    {
      description: "Say GoodBye",
      start: timeMaker(120),
      end: timeMaker(155),
      eventId: "fasalkjas",
      roomId: Room1.id
    },
    {
      description: "Stand Still",
      start: timeMaker(200),
      end: timeMaker(230),
      eventId: "fadflkaj",
      roomId: Room2.id
    }
  ]);
};
