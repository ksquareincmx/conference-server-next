const supertest = require("supertest");
const urlMaker = require("../testUtils/urlMaker");
const testServer = require("../testUtils/testBoot");

/**
 * TODO:
 * cannot book on weekends
 * cannot overlap schedules
 */
let request;

beforeEach(() => {
  request = supertest(testServer);
});

describe("Booking", () => {
  it("/ GET bookings as 3 lenght array", async () => {
    const { body } = await request.get(urlMaker("/Bookings"));
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(3);
  });

  it("/ POST a booking", async () => {
    const validStart = Date.now();
    const validEnd = Date.now() + 1000 * 60 * 30;
    const roomId = 2;

    const validRequest = await request.post(urlMaker("/Bookings")).send({
      roomId,
      start: validStart,
      end: validEnd,
      description: "Meeting with huge client",
      eventId: "aslkjsdf0i1"
    });

    expect(validRequest.status).toBe(200);
  });

  it("cannot post same start and same end", async () => {
    const start = Date.now();
    const roomId = 2;

    const validRequest = await request.post(urlMaker("/Bookings")).send({
      roomId,
      start,
      end: start,
      description: "Meeting with same start and ending",
      eventId: "aslkjsdf0i1"
    });

    expect(validRequest.status).toBe(400);
  });
});
