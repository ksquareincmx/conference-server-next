module.exports = App => {
  const { Booking } = App.models;

  Booking.create({
    description: "Salesforce meeting",
    start: 1563208353013,
    end: 1563208386518,
    eventId: "falkdsjf0i12"
  });
};
