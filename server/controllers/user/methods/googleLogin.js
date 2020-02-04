"use strict";

const { OAuth2Client } = require("google-auth-library");
const { isEmpty } = require("../../../utils");
const { log } = require("../../../libraries/log");
const { restApiRoot } = require("../../../config.local");
const {
  config: { auth }
} = require("../../../config/config");
const {
  errorFactory: { badRequest, unauthorized, serverError }
} = require("../../../factories/ErrorFactory");
const gAuthClient = new OAuth2Client(auth.google.clientId);
const { make } = require("../../../services/jwtService");
const { filterByEmail } = require("../queries");

function googleLogin(User) {
  return async function(idToken, next) {
    if (isEmpty(idToken)) {
      throw badRequest();
    }

    let ticket;
    try {
      ticket = await gAuthClient.verifyIdToken({
        idToken,
        audience: auth.google.clientId
      });
    } catch (e) {
      console.error(e);
      throw serverError();
    }

    const payload = ticket.getPayload();
    const userId = payload["sub"];
    const domain = payload["hd"] || payload["email"].split("@")[1];
    const email = payload["email"];
    const name = payload["name"];
    const picture = payload["picture"];

    const isValidDomain = domain => auth.google.allowedDomains.includes(domain);

    if (!isValidDomain(domain) || isEmpty(domain)) {
      // Unauthorized domain
      throw unauthorized();
    }

    let [conferenceUser, wasCreated] = await User.findOrCreate(
      filterByEmail(email),
      {
        email,
        name,
        picture,
        googleId: userId,
        password: 'anitalavalatina'
      }
    );

    // If the user was previously made and has no picture, update picture
    if (conferenceUser.picture !== picture) {
      conferenceUser.picture = picture;

      try {
        conferenceUser = await conferenceUser.save();
      } catch (e) {
        console.error(e);
      }
    }

    // Create jwt and send it to the client
    const token = await make(conferenceUser);

    return {
      token,
      user: conferenceUser
    };
  };
}

googleLogin.config = {
  http: {
    verb: "POST",
    path: "/google/oauth20"
  },
  accepts: [
    {
      arg: "idToken",
      require: true,
      type: "string"
    }
  ],
  returns: {
    arg: "data",
    type: "object",
    root: true
  }
};

module.exports = googleLogin;
