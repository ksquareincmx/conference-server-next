const pckg = require("../package.json");

const version = pckg.version.split(".").shift();

module.exports = {
  restApiRoot: `/api${version > 0 ? `/v${version}` : ""}`,
  host: process.env.HOST || "localhost",
  port: process.env.PORT || 3000
};
