const supertest = require("supertest");
const moment = require("moment");
const urlMaker = require("../testUtils/urlMaker");
/**
 * TODO:
 * wcannot overlap schedules
 * cannot book on weekends
 */

let request;

beforeEach(() => {
  request = supertest(require("../testUtils/testBoot"));
});

describe("GET /Bookings", () => {
  test("/Bookings as array", async () => {
    const res = await request
      .get(urlMaker("/bookings"))
      .set("Authorization", "USER_1");

    const { body, status } = res;
    expect(status).toBe(200);
    expect(Array.isArray(body)).toBe(true);
  });
});

describe("POST /Bookings", () => {
  test("Post a single boking", async () => {
    const validStart = moment().add("35", "minutes");
    const validEnd = moment(validStart.toISOString()).add("15", "minutes");
    const room_id = 2;

    const req = await request
      .post(urlMaker("/Bookings"))
      .set("Authorization", "USER_1")
      .send({
        room_id,
        user_id: 1,
        start: validStart.valueOf(),
        end: validEnd.valueOf(),
        description: "Meeting with huge client",
        event_id: "aslkjsdf0i1"
      });

    expect(req.status).toBe(200);
  });

  test("Cannot post same start and same end", async () => {
    const start = Date.now();
    const room_id = 2;

    const req = await request
      .post(urlMaker("/Bookings"))
      .set("Authorization", "USER_1")
      .send({
        room_id,
        start,
        end: start,
        description: "Meeting with same start and ending",
        event_id: "aslkjsdf0i1"
      });

    expect(req.status).toBe(422);
  });

  test("Cannot overlap bookings in the same room", async () => {
    const now = moment();
    const start = moment(now.toISOString()).add("1", "hours");
    const end = moment(start.toISOString()).add("15", "minutes");
    const invalidStart = moment(start.toISOString()).add("5", "minutes");
    const invalidEnd = end;
    const room_id = 2;

    const validRequest = await request
      .post(urlMaker("/Bookings"))
      .set("Authorization", "USER_1")
      .send({
        room_id,
        start: start.valueOf(),
        end: end.valueOf(),
        description: "Valid meeting",
        event_id: "aslkjsdf0i1"
      });

    expect(validRequest.status).toBe(200);

    const invalidRequest = await request
      .post(urlMaker("/Bookings"))
      .set("Authorization", "USER_1")
      .send({
        room_id,
        start: invalidStart.valueOf(),
        end: invalidEnd.valueOf(),
        description: "Invalid meeting"
      });

    expect(invalidRequest.status).toBe(422);
  });
});

describe("PUT /Bookings", () => {
  test("Update description /Bookings/${id}", async () => {
    const now = moment();
    const start = moment(now.toISOString()).add("2", "hours");
    const end = moment(start.toISOString()).add("30", "minutes");
    const room_id = 2;

    const req = await request
      .post(urlMaker("/Bookings"))
      .set("Authorization", "USER_1")
      .send({
        user_id: 1,
        room_id,
        start: start.valueOf(),
        end: end.valueOf(),
        description: "Prepare to update this meeting, dudeson!!!"
      });
    const { id } = req.body;

    expect(req.status).toBe(200);

    const putDescription = "This update is gr8, dudeson!!!";
    const putRequest = await request
      .put(urlMaker(`/Bookings/${id}`))
      .set("Authorization", "USER_1")
      .send({
        room_id,
        start: start.valueOf(),
        end: end.valueOf(),
        description: putDescription
      });

    expect(putRequest.status).toBe(200);
    expect(putRequest.body.description).toBe(putDescription);
  });

  test("Update start /Bookings/${id}", async () => {
    const now = moment();
    const start = moment(now.toISOString()).add("3", "hours");
    const end = moment(start.toISOString()).add("30", "minutes");
    const room_id = 2;
    const user_id = 1;
    const description = "Prepare to update this meeting, dudeson!!!";

    const req = await request
      .post(urlMaker("/Bookings"))
      .set("Authorization", "USER_1")
      .send({
        user_id,
        room_id,
        description,
        start: start.valueOf(),
        end: end.valueOf()
      });
    const { id } = req.body;

    expect(req.status).toBe(200);

    const putStart = moment(now.toISOString())
      .add("2", "hours")
      .add("15", "minutes");

    const putRequest = await request
      .put(urlMaker(`/Bookings/${id}`))
      .set("Authorization", "USER_1")
      .send({
        user_id,
        room_id,
        description,
        start: putStart.valueOf(),
        end: end.valueOf()
      });

    expect(putRequest.status).toBe(200);
  });
});

describe("DELETE /Bookings", () => {
  test("Delete booking /Booking/${id}", async () => {
    const now = moment();
    const start = moment(now.toISOString()).add("4", "hours");
    const end = moment(start.toISOString()).add("30", "minutes");
    const room_id = 2;
    const user_id = 1;

    const req = await request
      .post(urlMaker("/Bookings"))
      .set("Authorization", "USER_1")
      .send({
        user_id,
        room_id,
        description: "Delete bookings",
        start: start.valueOf(),
        end: end.valueOf()
      });
    const { id } = req.body;

    expect(req.status).toBe(200);

    const deleteRequest = await request
      .delete(`${urlMaker("/Bookings")}/${id}`)
      .set("Authorization", "USER_1");

    expect(deleteRequest.status).toBe(200);
  });

  test("Cannot delete other users bookings", async () => {
    const start = moment().add("4", "hours");
    const end = moment(start.toISOString()).add("30", "minutes");
    const room_id = 2;
    const user_id = 1;
    const user1Token = "USER_1";
    const user2Token = "USER_2";

    const req = await request
      .post(urlMaker("/Bookings"))
      .set("Authorization", user1Token)
      .send({
        user_id,
        room_id,
        description: "Test booking",
        start: start.valueOf(),
        end: end.valueOf()
      });

    const { id } = req.body;
    expect(req.status).toBe(200);

    const deleteRequest = await request
      .delete(`${urlMaker("/Bookings")}/${id}`)
      .set("Authorization", user2Token);

    expect(deleteRequest.status).toBe(401);
  });
});

describe("GET /getAvailableBookingsByRoom", () => {
  test("shows available rooms", async () => {
    const req = await request
      .post(urlMaker("/Bookings"))
      .set("Authorization", user1Token)
      .send({
        user_id,
        room_id,
        description: "Test booking",
        start: start.valueOf(),
        end: end.valueOf()
      });

    const getAvailableBookingsRequest = await request
      .post(urlMaker("/Bookings/getAvailableBookingsByRoom"))
      .set("Authorization", user1Token);

    expect(getAvailableBookingsRequest.body).toBe("hola0");
  });
});
// describe("DELETE /Bookings", () => {});
