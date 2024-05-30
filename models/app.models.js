const db = require("../db/connection");

function selectTopics() {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
}

function selectArticleById(article_id) {
  return db
    .query(
      `SELECT *
    FROM articles WHERE article_id = $1`,
      [article_id]
    )
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No user found for article_id: ${article_id}`,
        });
      } else {
        return result.rows[0];
      }
    });
}

function selectArticles() {
  return db
    .query(
      `SELECT 
        articles.article_id,
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT (comments.comment_id) AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        GROUP BY articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url
        ORDER BY articles.created_at DESC
        `
    )
    .then((result) => {
      return result.rows;
    });
}

module.exports = { selectTopics, selectArticleById, selectArticles };
