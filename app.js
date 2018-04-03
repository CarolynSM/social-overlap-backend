const express = require("express");
const cors = require("cors");
const path = require("path");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const { getFollowers, getFollowing } = require("./nightmare.js");
const {
  getPublicFollowersTotal,
  getPublicFollowers,
  getPublicPercentage,
  getThirdDegreeFollowers,
  sortAndCountDuplicates,
  getTopFive
} = require("./dataAnalysis.js");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

let userFollowersList;

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
        totalFollowers: res.graphql.user.edge_followed_by.count,
        profileImg: res.graphql.user.profile_pic_url,
        isPrivate: res.graphql.user.is_private
      };
    })
    .then(res => response.send({ profile: data }))
    .catch(error => console.log(error));
});

app.get("/:userId/followers", (request, response, next) => {
  const userId = request.params.userId;
  const variables = { id: `${userId}`, first: 425, after: "" };
  return getFollowers(userId)
    .then(async res => {
      const publicFollowersTotal = await getPublicFollowersTotal(res);
      const publicFollowersArray = await getPublicFollowers(res);
      const publicPercentage = await getPublicPercentage(res, publicFollowersTotal);
      const masterFollowers = await getThirdDegreeFollowers(publicFollowersArray);
      // const sortedFollowers = await sortAndCountDuplicates(masterFollowers);
      response.send({
        total_public_followers: publicFollowersTotal,
        percentage_public_followers: publicPercentage,
        master_followers: masterFollowers
        // top_five: getTopFive(sortedFollowers)
      });
    })
    .catch(next);
});

app.get("/:userId/following", (request, response, next) => {
  const userId = request.params.userId;
  const variables = { id: `${userId}`, first: 425, after: "" };
  return getFollowing(userId)
    .then(res => response.send({ data: res }))
    .catch(next);
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
    error: req.app.get("env") !== "production" ? err.stack : {}
  });
});

app.listen(process.env.PORT || 3000);

module.exports = app;
