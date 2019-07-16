const supertest = require("supertest");
const server = require("./server");

const request = supertest(server);

describe("Server works", () => {
  it("GET /", async () => {
    const res = await request.get("/");
    expect(res.status).toBe(200);
  });
});
