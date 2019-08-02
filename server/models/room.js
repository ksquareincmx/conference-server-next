const {
  getAvailableBookingsByRoom,
  getAvailableBookingsByRoomDescription
} = require("../controllers/room/getAvailableBookingsByRoom");

module.exports = function(Room) {
  Room.validatesUniquenessOf("name", { message: "email is not unique" });

  const bindedGetAvailableBookingsByRoom = getAvailableBookingsByRoom.bind(
    Room
  );

  const { name: availableBookings } = getAvailableBookingsByRoomDescription;

  Room.getAvailableBookingsByRoom = bindedGetAvailableBookingsByRoom;

  Room[availableBookings] = bindedGetAvailableBookingsByRoom;
  Room.remoteMethod(availableBookings, getAvailableBookingsByRoomDescription);
};
