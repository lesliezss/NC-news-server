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
  test("200: GET responds with an array of topic objects", () => {
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
  test("200 GET: responds with an object describing all other endpoints available", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpointsData).toBeInstanceOf(Object);
        expect(body.endpointsData).toEqual(endpointsData);
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("200 GET: responds with an article object", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        console.log(body.article)
        expect(body.article).toEqual({
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
      });
  });

  test("status:400, responds with an error message when passed a bad article ID",()=>{
    return request(app)
    .get("/api/articles/notAnId")
    .expect(400)
    .then(({body})=>{
        expect(body.msg).toBe("Invalid Input")
    })
  })

  test("status 404, responds with an error message when passed an id that's not in the database", ()=>{
    return request(app)
    .get("/api/articles/100")
    .expect(404)
    .then(({body})=>{
        expect(body.msg).toBe("No user found for article_id: 100")
    })
  })
});
