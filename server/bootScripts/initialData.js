module.exports = App => {
  const { Room, Booking } = App.models;

  Room.create(
    [
      {
        name: "BlackRoom",
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
          description: "Salesforce meeting",
          start: 1563208353013,
          end: 1563208386518,
          eventId: "falkdsjf0i12",
          roomId: room1.id,
          attendees: ["martiuh@gmail.com"]
        },
        {
          description: "React Reaction",
          start: 1563299709242,
          end: 1563299724720,
          eventId: "fasalkjas",
          roomId: room1.id
        },
        {
          description: "Drink Water",
          start: 156320835301390,
          end: 15632997247201,
          eventId: "fadflkaj",
          roomId: room2.id
        }
      ]);
    }
  );
};
