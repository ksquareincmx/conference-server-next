const supertest = require("supertest");
const server = require("../../server");
const urlMaker = require("../testUtils/urlMaker");

const request = supertest(server);

describe("Booking", () => {
  it("/ GET all Bookings as array", async () => {
    const res = await request.get(urlMaker("/Bookings"));
    expect(Array.isArray(res.body)).toBe(true);
  });
});
