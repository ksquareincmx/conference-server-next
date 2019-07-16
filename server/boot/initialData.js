module.exports = App => {
  const { Room, Booking } = App.models;

  Room.create(
    {
      name: "BlackRoom",
      bgColor: "#000",
      txtColor: "#FFF"
    },
    (err, room) => {
      Booking.create([
        {
          description: "Salesforce meeting",
          start: 1563208353013,
          end: 1563208386518,
          eventId: "falkdsjf0i12",
          bookingsId: room.id
        },
        {
          description: "React Reaction",
          start: 1563299709242,
          end: 1563299724720,
          eventId: "fasalkjas",
          bookingsId: room.id
        }
      ]);
    }
  );
};
