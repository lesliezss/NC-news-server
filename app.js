const { getTopics, getEndpointsData ,getArticleById} = require("./controllers/app.controller");
const express = require("express");
const app = express();

app.get("/api/topics", getTopics);

app.get("/api", getEndpointsData);

app.get("/api/articles/:article_id",getArticleById)


app.use((err, req, res, next)=>{
    if(err.status){
        res.status(err.status).send({msg: err.msg})
    } else next(err)
})

app.use((err, req, res, next)=>{
    if(err.code === '22P02'){
        res.status(400).send({msg:'Invalid Input'})
    }else next(err)
})

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = { app };
