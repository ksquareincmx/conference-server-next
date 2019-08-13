// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
"use strict";
require("dotenv").config();
const loopback = require("loopback");
const boot = require("loopback-boot");
const path = require("path");
const { googleAuthRouter } = require("./routers/googleAuthRouter");
const {
  config: {
    auth: { slack }
  }
} = require("./config/config");
const app = (module.exports = loopback());
const { restApiRoot } = require("./config.local");
const officeConfig = require("../office-config");

app.officeConfig = officeConfig; // Set custom officeConfig object to whole app context;
app.start = function() {
  // start the web server
  return app.listen(function() {
    /*app.use(googleAuthRouter);*/
    app.emit("started");
    const baseUrl = app.get("url").replace(/\/$/, "");
    console.log("Web server listening at: %s", baseUrl);
    if (app.get("loopback-component-explorer")) {
      const explorerPath = app.get("loopback-component-explorer").mountPath;
      console.log("Browse your REST API at %s%s", baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(
  app,
  {
    appRootDir: __dirname,
    bootDirs: [
      path.resolve(__dirname, "bootScripts"),
      path.resolve(__dirname, "devBootScripts")
    ]
  },
  function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module) app.start();
  }
);
