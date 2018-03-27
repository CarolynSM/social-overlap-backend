var Nightmare = require("nightmare");
var nightmare = Nightmare({ show: true });

nightmare
  .goto("https://www.instagram.com/")
  .click("._g9ean a")
  .type("#f380dcd26b0d66c", "socialoverlap")
  .type("#f4fa733919453", "soigSandyH00k")
  .click("_qv64e _gexxb _4tgw8 _njrw0 button")
  .end()
  .catch(error => {
    console.error("Search failed:", error);
  });
