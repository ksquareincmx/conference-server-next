"use strict";

const { make: makeJwt } = require('../services/jwtService.js');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const { createPromiseCallback } = require('loopback/lib/utils');
const { jwtSecret, appUri, restApiRoot, auth: { slack: { clientId, clientSecret, redirectUri } } } = require('../config.local.js');
const { userBeforeSave } = require("../controllers/user/userBeforeSave");

module.exports = function(User) {

  User.observe("before save", userBeforeSave);

  User.slackLogin = async function (code, res, cb) {

    try {

      const exchangeBody = new URLSearchParams();
      exchangeBody.append('client_id', clientId);
      exchangeBody.append('client_secret', clientSecret);
      exchangeBody.append('code', code);
      exchangeBody.append('redirect_uri',
        `${redirectUri}${restApiRoot}/Users/slack/oauth20`);

      const exchangeResponse = await fetch("https://slack.com/api/oauth.access", {
        method: "POST",
        body: exchangeBody
      });

      const { ok: responseOk, authorizing_user, access_token: slackAccessToken } = await exchangeResponse.json();

      if (responseOk) {

        const userProfileBody = new URLSearchParams();
        userProfileBody.append('token', slackAccessToken);

        const userRes = await fetch("https://slack.com/api/users.profile.get", {
          method: "POST",
          body: userProfileBody
        });

        const { ok: userProfileOk, profile } = await userRes.json();

        if (userProfileOk) {

          const { email, real_name: name, image_512: picture } = profile;

          const [ userInstance, wasCreated] = await User.findOrCreate({
            where: {
              email
            }
          }, {
            email,
            name,
            picture
          });

          userInstance.slackAccessToken = slackAccessToken;

          await userInstance.save();

          const accessToken = await makeJwt(userInstance);
          console.log(accessToken);
          const redirectToQueries = new URLSearchParams();
          redirectToQueries.append('access_token', accessToken);
          redirectToQueries.append('user', JSON.stringify(userInstance));

          res.redirect(appUri + '/login?' + redirectToQueries.toString());

        } else {
          const e = new Error('Slack profile get failed');
          e.statusCode = 500;
          cb(e);
        }

      } else {
        const e = new Error('Slack exchange failed');
        e.statusCode = 500;
        cb(e);
      }

    } catch (e) {
      cb(e);
    }

  };

  User.remoteMethod("slackLogin", {
    http: {
      verb: "GET",
      path: "/slack/oauth20"
    },
    accepts: [
      {
        arg: "code",
        type: "string",
        required: true,
        http: {
          source: "query"
        }
      },
      {
        arg: "res",
        type: "object",
        http: {
          source: "res"
        },
        root: true
      }
    ]
  });

};
