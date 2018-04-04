const fetch = require("node-fetch");
const { getFollowers, getFollowing } = require("./nightmare.js");

async function getProfile(user) {
  let userName = user.node.username;
  const res = await fetch("https://www.instagram.com/" + userName + "/?__a=1");
  const profile = await res.json();
  return {
    id: profile.graphql.user.id,
    username: profile.graphql.user.username,
    is_private: profile.graphql.user.is_private
  };
}

function getPublicFollowersTotal(list) {
  const followers = list.data.user.edge_followed_by.edges;
  const profile = followers.map(user => getProfile(user));
  return Promise.all(profile).then(res => {
    return res.filter(user => user.is_private === false).length;
  });
}

function getPublicFollowers(list) {
  const followers = list.data.user.edge_followed_by.edges;
  const profile = followers.map(user => getProfile(user));
  return Promise.all(profile).then(res => {
    return res.filter(user => user.is_private === false);
  });
}

function getPublicPercentage(list, publicCount) {
  const totalCount = list.data.user.edge_followed_by.edges.length;
  const percentPublic = publicCount / totalCount * 100;
  return {
    total_followers: totalCount,
    public_followers: publicCount,
    percent_public: percentPublic
  };
}

function getThirdDegreeFollowers(publicList) {
  let firstUser = publicList[0];
  const output = getFollowing(firstUser.id);
  return Promise.all(output);

  // const masterFollowers = [];
  // const users = publicList.map(user => {
  //   let userId = user.id;
  //   return {
  //     userId: userId,
  //     variables: { id: `${userId}`, first: 100, after: "" }
  //   };
  // });
  // const followingList = users.map(user => {
  //   let userId = user.userId;
  //   return getFollowers(userId);
  // });
  // return Promise.all(followingList).then(res => {
  //   res.forEach(item => masterFollowers.push(item));
  //   return masterFollowers;
  // });
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
