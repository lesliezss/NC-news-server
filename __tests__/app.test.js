const testData = require("../db/data/test-data/index");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
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
        expect(body.article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test("status:400, responds with an error message when passed a bad article ID", () => {
    return request(app)
      .get("/api/articles/notAnId")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });

  test("status 404, responds with an error message when passed an id that's not in the database", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user found for article_id: 100");
      });
  });
});

describe("/api/articles", () => {
  test("200 GET: responds with an articles array of all article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].comment_count).toBe("2");
        expect(body.articles).toHaveLength(13);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  //We need another happy path test here. What if the article exists in the DB but it has no comments? We should return that empty array! You will need to check whether the article exists so that the error you have for a non-existent article still passes. Also there is no test that the comments are in the required order - most recent first.
  test("200 GET: responds with an array of comments for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("status 400: responds with an error message when passed an invalid id", () => {
    return request(app)
      .get("/api/articles/NotAnId/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("status 404: responds with an error message when passed an id that's not in the database", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No comment found for article id: 100");
      });
  });
});

describe("/api/articles/:article_id/comments", () => {
  test("201 POST: add a comment for an article, responds with the posted comment", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Good!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          body: "Good!",
          author: "butter_bridge",
          article_id: 1,
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test("status 404: responds with an error message when passed a username that's not in database", () => {
    const newComment = {
      username: "test_username",
      body: "Good!",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });
  test("status 400: responds with an error message when passed an invalid article id", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Good!",
    };
    return request(app)
      .post("/api/articles/notAnId/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("status 404: responds with an error message when passed an article id that does not in the database", () => {
    const newComment = {
      username: "butter_bridge",
      body: "Good!",
    };
    return request(app)
      .post("/api/articles/100/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found for article id: 100");
      });
  });
});

describe("/api/articles/:article_id", () => {
  test("200 PATCH: updates an article by article_id and responds with the updated article", () => {
    const newVote = { inc_votes: 2 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVote)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 102,
          article_img_url: expect.any(String),
        });
      });
  });
  
  test("status 400: responds with an error message when passed an invalid article id", () => {
    const newVote = { inc_votes: 2 };

    return request(app)
      .patch("/api/articles/notAnId")
      .send(newVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid Input");
      });
  });
  test("status 404: responds with an error message when passed an article id that does not in the database", () => {
    const newVote = { inc_votes: 2 };

    return request(app)
      .patch("/api/articles/100")
      .send(newVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No article found for article id: 100");
      });
  });
});

describe("/api/comments/:comment_id",()=>{
  test("204 DELETE: delete the given comment by comment_id",()=>{
    return request(app)
    .delete("/api/comments/1")
    .expect(204)
  })
  test('status 404: responds with an error when trying to delete a comment that does not exist', () => {
    return request(app)
        .delete("/api/comments/100")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('No comment found on comment id: 100');
        });
});

    test('status 400: responds with an error when given an invalid comment_id', () => {
    return request(app)
        .delete("/api/comments/notAnId")
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid Input');
        });
});
});


