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
        console.log(result.rows[0])
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

function selectCommentsByArticleId(article_id) {
  return db
    .query(
      `
SELECT * 
FROM comments 
WHERE article_id = $1`,
      [article_id]
    )
    .then((result) => {
      const comment = result.rows[0];
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for article id: ${article_id}`,
        });
      } else {
        return result.rows;
      }
    });
}

function addCommentModel(username, body, article_id) {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: `Username not found`,
        });
      }
      return db
        .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
      })

      .then((result) => {
        if (!result.rows.length) {
          return Promise.reject({
            status: 404,
            msg: `No article found for article id: ${article_id}`,
          });
        }
        return db.query(
          `
          INSERT INTO comments (body, author, article_id, votes, created_at)
          VALUES ($1, $2, $3, $4, Now()) RETURNING *`,
          [body, username, article_id, 0]
        );
      })

    .then((result) => {
      return result.rows[0];
    });
}

module.exports = {
  selectTopics,
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  addCommentModel,
};
