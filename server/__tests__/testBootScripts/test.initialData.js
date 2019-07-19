module.exports = App => {
  const { Room, Booking } = App.models;

  const timeMaker = (minutes = 1, initialDate) => {
    initialDate = initialDate || Date.now();
    return initialDate + 1000 * 60 * minutes;
  };

  Room.create(
    [
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
    ],
    (err, [room1, room2]) => {
      Booking.create([
        {
          description: "Say Hello",
          start: timeMaker(30),
          end: timeMaker(60),
          eventId: "falkdsjf0i12",
          roomId: room1.id,
          attendees: ["martiuh@gmail.com"]
        },
        {
          description: "Say GoodBye",
          start: timeMaker(120),
          end: timeMaker(155),
          eventId: "fasalkjas",
          roomId: room1.id
        },
        {
          description: "Stand Still",
          start: timeMaker(200),
          end: timeMaker(230),
          eventId: "fadflkaj",
          roomId: room2.id
        }
      ]);
    }
  );
};
