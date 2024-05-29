const { selectTopics } = require("../models/app.models");
const endpointsData = require("../endpoints.json");

exports.getTopics = (req, res, next) => {
  return selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      console.error("Error caught in getTopics:", err);
      next(err);
    });
};

exports.getEndpointsData = (req, res, next) => {
  return res.status(200).send({ endpointsData });
};
