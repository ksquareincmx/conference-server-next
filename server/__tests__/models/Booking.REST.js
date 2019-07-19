const supertest = require("supertest");
const urlMaker = require("../testUtils/urlMaker");

/**
 * TODO:
 * cannot book on weekends
 * cannot overlap schedules
 */

let request;

beforeEach(() => {
  request = supertest(require("../testUtils/testBoot"));
});

describe("Booking", () => {
  test("GET /Bookings as 3 length array", async () => {
    const { body } = await request
      .get(urlMaker("/bookings"))
      .set("Authorization", "USER_1");
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(3);
  });

  it("POST /Bookings", async () => {
    const validStart = Date.now();
    const validEnd = Date.now() + 1000 * 60 * 30;
    const roomId = 2;
    const userId = 1; // USER_1

    const validRequest = await request
      .post(urlMaker("/Bookings"))
      .set("Authorization", "USER_1")
      .send({
        roomId,
        start: validStart,
        end: validEnd,
        description: "Meeting with huge client",
        eventId: "aslkjsdf0i1",
        userId: 1
      });

    expect(validRequest.status).toBe(200);
  });

  it("POST /Bookings cannot post same start and same end", async () => {
    const start = Date.now();
    const roomId = 2;

    const validRequest = await request
      .post(urlMaker("/Bookings"))
      .set("Authorization", "USER_1")
      .send({
        roomId,
        start,
        end: start,
        description: "Meeting with same start and ending",
        eventId: "aslkjsdf0i1"
      });

    expect(validRequest.status).toBe(400);
  });
});
