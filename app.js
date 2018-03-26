const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (request, response) => {
  response.json({ message: "Welcome to Social Overlap" });
});

app.get("/:userName", (request, response) => {
  let data;
  fetch("https://www.instagram.com/" + request.params.userName + "/?__a=1")
    .then(res => res.json())
    .then(res => {
      data = {
        userName: res.graphql.user.username,
        fullName: res.graphql.user.full_name,
        userId: res.graphql.user.id,
        totalFollowers: res.graphql.user.edge_follow.count,
        profileImg: res.graphql.user.profile_pic_url,
        isPrivate: res.graphql.user.is_private
      };
    })
    .then(res => response.send({ profile: data }))
    .catch(error => console.log(error));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}
  });
});

app.listen(process.env.PORT || 3000);

module.exports = app;
