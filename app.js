const { getTopics, getEndpointsData } = require("./controllers/app.controller");
const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpointsData);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = { app };
