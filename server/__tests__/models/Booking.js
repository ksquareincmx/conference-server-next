const supertest = require("supertest");
const server = require("../../../server/server");
const { restApiRoot } = require("../../../server/config.local");

const request = supertest(server);

const urlMaker = str => `${restApiRoot}/${str}`;

describe("Booking", () => {
  it("/ GET all Bookings as array", async () => {
    const res = await request.get(urlMaker("/Bookings"));
    expect(Array.isArray(res.body)).toBe(true);
  });
});
