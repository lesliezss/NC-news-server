const { selectTopics } = require("../models/app.models");

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
