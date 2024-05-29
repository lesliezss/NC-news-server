const db = require("../db/connection");

function selectTopics() {
  return db.query(`SELECT * FROM topics`).then((result) => {
    return result.rows;
  });
}

function selectArticleById(article_id) {
  return db
    .query(
      `SELECT title,
    topic,
    author,
    body,
    created_at,
    votes,
    article_img_url 
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

module.exports = { selectTopics, selectArticleById };
