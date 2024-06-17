const {
  getTopics,
  getEndpointsData,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  addComment,
  updateArticleById,
  deleteCommentById,
} = require("./controllers/app.controller");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpointsData);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", addComment);

app.patch("/api/articles/:article_id", updateArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
