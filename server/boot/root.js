// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

module.exports = function(server) {
  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  router.post("/", server.loopback.status());
  server.use(router);
};
