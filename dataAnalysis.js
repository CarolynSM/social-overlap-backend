const fetch = require("node-fetch");
const { getFollowers } = require("./nightmare.js");

function getPublicFollowersTotal(list) {
  const publicFollowers = [];
  let followers = list.data.user.edge_followed_by.edges;
  followers.forEach(user => {
    let userName = user.node.username;
    console.log(userName);
    fetch("https://www.instagram.com/" + userName + "/?__a=1")
      .then(res => res.json())
      .then(res => {
        if (!res.graphql.user.is_private) {
          publicFollowers.push(user);
        }
      });
  });
  return publicFollowers.length;
}

function getPublicFollowers(list) {
  const publicFollowers = [];
  let followers = list.data.user.edge_followed_by.edges;
  followers.forEach(user => {
    let userName = user.node.username;
    fetch("https://www.instagram.com/" + userName + "/?__a=1")
      .then(res => res.json())
      .then(res => {
        if (!res.graphql.user.is_private) {
          publicFollowers.push(user);
        }
      });
  });
  return publicFollowers;
}

function getPublicPercentage(list) {
  const totalCount = list.data.user.edge_followed_by.edges.length;
  const publicCount = getPublicFollowers(list);
  const percentPublic = publicCount / totalCount * 100;
  return {
    total_followers: totalCount,
    public_followers: publicCount,
    percent_public: percentPublic
  };
}

function getThirdDegreeFollowers(publicList) {
  const masterFollowers = [];
  publicList.forEach(user => {
    const userId = user.node.id;
    const variables = { id: `${userId}`, first: 425, after: "" };
    return getFollowers(userId)
      .then(res => {
        const followersArray = res.data.user.edge_followed_by.edges;
        followersArray.forEach(user => {
          const followerName = { name: user.node.username };
          masterFollowers.push(followerName);
        });
      })
      .catch(next);
  });
  return masterFollowers;
}

function sortAndCountDuplicates(list) {
  const sortedList = list.sort();
  const copy = sortedList.slice(0);
  const output = [];
  for (let i = 0; i < sortedList.length; i++) {
    let count = 0;
    for (let j = 0; j < copy.length; j++) {
      if (sortedList[i] == copy[j]) {
        count++;
        copy.pop(copy[j]);
      }
    }
    if (count > 0) {
      var item = new Object();
      item.value = sortedList[i];
      item.count = count;
      output.push(item);
    }
  }
  return output.sort();
}

function getTopFive(list) {
  return list.slice(0, 6);
}

module.exports = {
  getPublicFollowersTotal,
  getPublicFollowers,
  getPublicPercentage,
  getThirdDegreeFollowers,
  sortAndCountDuplicates,
  getTopFive
};
