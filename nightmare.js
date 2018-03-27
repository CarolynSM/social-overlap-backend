const Nightmare = require("nightmare");
const nightmare = Nightmare({ show: false });

function instagramLogin() {
  return nightmare
    .goto("https://www.instagram.com/")
    .click("a[href=\"/accounts/login/\"]")
    .type("[autocapitalize=\"off\"][type=\"text\"]", "socialoverlap")
    .type("[autocapitalize=\"off\"][type=\"password\"]", "soigSandyH00k")
    .click("form span > button")
    .wait("[role=\"dialog\"] > button")
    .click("[role=\"dialog\"] > button")
    .wait("main>section")
    .scrollTo(900, 0)
    .wait(500)
    .scrollTo(1900, 0)
    .wait(500)
    .evaluate(() => {
      return document.querySelector("main>section").innerHTML;
    })
    .end()
    .catch(error => {
      console.error("Search failed:", error);
      return error;
    });
}

module.exports = { instagramLogin };
