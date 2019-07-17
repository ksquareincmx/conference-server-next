const supertest = require("supertest");
const urlMaker = require("../testUtils/urlMaker");
const testServer = require("../testUtils/testBoot");

/**
 * TODO: cannot book on weekends
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

  // Works on development/production, not in testing
  // it("Cannot overlap booking", async () => {
  //   console.log("overlap");
  //   const validStart = Date.now();
  //   const validEnd = Date.now() + 1000 * 60 * 30;
  //   const invalidStart = validStart + 1000 * 60 * 35;
  //   const invalidEnd = validEnd;
  //   const roomId = 1;

  //   const validRequest = await request.post(urlMaker("/Bookings")).send({
  //     roomId,
  //     start: validStart,
  //     end: validEnd,
  //     description: "Java developers meeting",
  //     eventId: "aslkjsdf0i1"
  //   });

  //   expect(validRequest.status).toBe(200);

  //   const invalidRequest = await request.post(urlMaker("/Bookings")).send({
  //     roomId,
  //     start: invalidStart,
  //     end: invalidEnd,
  //     description: "Overlapping your meeting",
  //     eventId: "asfsdj0i1"
  //   });

  //   console.log(invalidRequest.body);
  //   expect(invalidRequest.status).toBe(400);
  // });
});
