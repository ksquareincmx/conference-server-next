const fp = require("lodash/fp");
const { toSyntax } = require("../utils");

const roomMapper = {
  toEntity: roomJSON => toSyntax(roomJSON, fp.camelCase),

  toDTO: roomEntity => toSyntax(roomEntity, fp.snakeCase),

  toJSON: room => room.toJSON(),

  toSlackFormat: rooms =>
    rooms.map(room => {
      const { id, name } = room;
      return { label: name, value: String(id) };
    })
};

module.exports = roomMapper;
