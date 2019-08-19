// Copyright IBM Corp. 2016. All Rights Reserved.
// Node module: loopback-workspace
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

"use strict";

module.exports = function enableAuthentication(server) {
  // enable authentication
  server.enableAuth();

  server.isAuthEnabled = false;
  overrideAuth(server);

};

function overrideAuth(server) {

  const { AccessToken } = server.models;
  const remotes = server.remotes();
  const oldAuth = remotes.authorization.bind(remotes);

  remotes.authorization = function(ctx, next) {

    const { slackAccess, currentUser } = ctx.req;

    if (slackAccess) {
      ctx.req.remotingContext.options = ctx.req.remotingContext.options || {};
      ctx.req.remotingContext.options.slackAccess = slackAccess;
    } else if (currentUser) {
      ctx.req.accessToken = ctx.accessToken = new AccessToken({
        userId: currentUser.id,
        user: currentUser
      });
    }

    oldAuth(ctx, next)

  };

}
