const supertest = require("supertest");
const server = require("../server");

const request = supertest(server);

describe("Server http responses", () => {
  it("GET /", async () => {
    const res = await request.get("/explorer");
    expect(res.status).toBe(200);
  });
});
