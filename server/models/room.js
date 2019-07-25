"use strict";

module.exports = function(Room) {
  Room.validatesUniquenessOf("name", { message: "email is not unique" });
};
