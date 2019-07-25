const supertest = require("supertest");
const moment = require("moment");
const urlMaker = require("../testUtils/urlMaker");
/**
 * TODO:
 * cannot overlap schedules
 * cannot book on weekends
 */

let request;

beforeEach(() => {
  request = supertest(require("../testUtils/testBoot"));
});

describe("POST /Rooms", () => {
  test("Admin user can create room", async () => {
    const newRoom = {
      name: "Hogwarts",
      bg_color: "#AA2E22",
      txt_color: "#BB8F28"
    };

    const res = await request
      .post(urlMaker("/Rooms"))
      .set("Authorization", "ADMIN")
      .send(newRoom);

    expect(res.status).toBe(200);
  });

  test("Non admin cannot create room", async () => {
    const newRoom = {
      name: "Hogwarts",
      bg_color: "#AA2E22",
      txt_color: "#BB8F28"
    };

    const res = await request
      .post(urlMaker("/Rooms"))
      .set("Authorization", "USER_1")
      .send(newRoom);

    expect(res.status).toBe(401);
  });

  test("Admin user can delete room", async () => {
    const newRoom = {
      name: "Avengers Land",
      bg_color: "#eee",
      txt_color: "#f00"
    };

    const roomRequest = await request
      .post(urlMaker("/Rooms"))
      .set("Authorization", "ADMIN")
      .send(newRoom);

    expect(roomRequest.status).toBe(200);

    const deleteRequest = await request
      .delete(urlMaker(`/Rooms/${roomRequest.body.id}`))
      .set("Authorization", "ADMIN");

    expect(deleteRequest.status).toBe(200);
  });

  test("Non admin user cannot delete room", async () => {
    const newRoom = {
      name: "Hola Mundo Mundial",
      bg_color: "#eee",
      txt_color: "#f00"
    };

    const roomRequest = await request
      .post(urlMaker("/Rooms"))
      .set("Authorization", "ADMIN")
      .send(newRoom);

    expect(roomRequest.status).toBe(200);

    const deleteRequest = await request
      .delete(urlMaker(`/Rooms/${roomRequest.body.id}`))
      .set("Authorization", "USER_1");

    expect(deleteRequest.status).toBe(401);
  });
});
