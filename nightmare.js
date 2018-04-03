const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: false });
const fs = require("fs");

function getFollowers(userId) {
  const variables = { id: `${userId}`, first: 425, after: "" };
  fs.writeFileSync("/tmp/nightmare.js", "window.variables = " + JSON.stringify(variables));
  return nightmare
    .goto("https://www.instagram.com/")
    .click("a[href=\"/accounts/login/\"]")
    .type("[autocapitalize=\"off\"][type=\"text\"]", "socialoverlap")
    .type("[autocapitalize=\"off\"][type=\"password\"]", "soigSandyH00k")
    .click("form span > button")
    .wait("[role=\"dialog\"] > button")
    .click("[role=\"dialog\"] > button")
    .wait("main>section")
    .inject("js", "/tmp/nightmare.js")
    .evaluate(() => {
      return fetch(
        "https://www.instagram.com/graphql/query/?query_id=17851374694183129&variables=" +
          JSON.stringify(window.variables),
        {
          credentials: "include"
        }
      ).then(res => res.json());
    })
    .end()
    .catch(error => {
      console.error("Search failed:", error);
      return error;
    });
}

function getFollowing(userId) {
  console.log("test");
  const variables = { id: `${userId}`, first: 10, after: "" };
  fs.writeFileSync("/tmp/nightmare.js", "window.variables = " + JSON.stringify(variables));
  return nightmare
    .goto("https://www.instagram.com/")
    .click("a[href=\"/accounts/login/\"]")
    .type("[autocapitalize=\"off\"][type=\"text\"]", "socialoverlap")
    .type("[autocapitalize=\"off\"][type=\"password\"]", "soigSandyH00k")
    .click("form span > button")
    .wait("[role=\"dialog\"] > button")
    .click("[role=\"dialog\"] > button")
    .wait("main>section")
    .inject("js", "/tmp/nightmare.js")
    .evaluate(() => {
      return fetch(
        "https://www.instagram.com/graphql/query/?query_id=17874545323001329&variables=" +
          JSON.stringify(window.variables),
        {
          credentials: "include"
        }
      ).then(res => res.json());
    })
    .end()
    .catch(error => {
      console.error("Search failed:", error);
      return error;
    });
}

module.exports = { getFollowers, getFollowing };
