# Northcoders News API

##Connecting to different PostgreSQL databases

Three are two database: nc_news and nc_news_test

To connet to the right database, you will need to create two .env files for your project: .env.test and .env.development. 

In .env.test: PGDATABASE=test_database_name
In .env.development: PGDATABASE=development_database_name

And then add .env.* to the .gitignore


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
