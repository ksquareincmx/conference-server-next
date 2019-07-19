const supertest = require("supertest");
const server = require("../server");

const request = supertest(server);

describe("App basic http responses", () => {
  it("GET /", async () => {
    const res = await request.get("/");
    expect(res.status).toBe(200);
  });

  it("GET /explorer/", async () => {
    const res = await request.get("/explorer/");
    expect(res.status).toBe(200);
  });
});
