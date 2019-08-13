const {
  getAvailableBookingsByRoom
} = require("../controllers/room/methods");

module.exports = function(Room) {

  Room.validatesUniquenessOf("name", { message: "email is not unique" });

  Room.getAvailableBookingsByRoom = getAvailableBookingsByRoom(Room);
  Room.remoteMethod(getAvailableBookingsByRoom.name, getAvailableBookingsByRoom.config);

};
