const supertest = require("supertest");
// const server = require("../../server");
const urlMaker = require("../testUtils/urlMaker");
const boot = require("../testUtils/testBoot");

const request = supertest(boot);

describe("Booking", () => {
  it("/ GET all Bookings as array", async () => {
    const { body } = await request.get(urlMaker("/Bookings"));
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(3);
  });

  it("/ POST a booking", async () => {
    expect(1).toBe(2);
  });
});
