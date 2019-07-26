// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
"use strict";
require("dotenv").config();
const boot = require("loopback-boot");
const path = require("path");

const app = (module.exports = require("./app"));

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(
  app,
  {
    appRootDir: path.join(__dirname, "..", ".."),
    bootDirs: [path.join(__dirname, "../testBootScripts/")]
  },
  function(err) {
    if (err) throw err;

    // start the server if `$ node server.js`
    if (require.main === module) app.start();
  }
);
