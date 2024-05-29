const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const { app } = require("../app");
const endpointsData = require("../endpoints.json");

beforeEach(async () => {
  await seed(testData);
});

afterAll(async () => {
  await db.end();
});

describe("GET /api/topics", () => {
  test("200: GET response with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("/api", () => {
  test("200 GET: response with an object describing all other endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpointsData).toBeInstanceOf(Object);
        expect(body.endpointsData).toEqual(endpointsData);
      });
  });
});
