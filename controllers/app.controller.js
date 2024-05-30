const { selectTopics, selectArticleById, selectArticles,selectCommentsByArticleId } = require("../models/app.models");
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

exports.getArticleById =(req, res, next)=>{
    const {article_id} = req.params
    return selectArticleById(article_id)
    .then((article)=>{
        res.status(200).send({article})
    })
    .catch(next)
}

exports.getArticles =(req, res, next)=>{
    return selectArticles()
    .then((articles)=>{
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getCommentsByArticleId = (req, res, next)=>{
  const {article_id} = req.params
  return selectCommentsByArticleId(article_id)
  .then((comments)=>{
    res.status(200).send({comments})
  })
  .catch(next)
}
