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

  const [User1, User2, User3] = await user.create([
    {
      email: "foo@gmail.com",
      name: "Bar González",
      password: "HAHA"
    },
    {
      email: "bar@gmail.com",
      name: "Foo Ruano",
      password: "HEHE"
    },
    {
      email: "baz@gmail.com",
      name: "Admin Administer",
      password: "HIHI",
      role: "admin"
    }
  ]);

  AccessToken.create([
    {
      id: "USER_1",
      userId: User1.id
    },
    {
      id: "USER_2",
      userId: User2.id
    },
    {
      id: "ADMIN",
      userId: User3.id
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
    }
  ]);
};
