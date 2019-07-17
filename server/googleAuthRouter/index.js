const { OAuth2Client } = require("google-auth-library");
const { Router } = require("express");
const { isEmpty } = require("../utils");
const { log } = require("../libraries/log");
const { restApiRoot } = require("../config.local");
const {
  config: { auth }
} = require("../config/config");

const gAuthClient = new OAuth2Client(auth.google.clientId);

const googleAuthRouter = Router();
const googleAuthUrl = `${restApiRoot}/auth/googlelogin`;

googleAuthRouter.post(googleAuthUrl, async (req, res) => {
  const { idToken } = req.body;
  if (isEmpty(idToken)) {
    return res.sendStatus(400);
  }
  try {
    const ticket = await gAuthClient.verifyIdToken({
      idToken,
      audience: auth.google.clientId
    });

    const payload = ticket.getPayload();
    const userId = payload["sub"];
    const domain = payload["hd"] || payload["email"].split("@")[1];
    const email = payload["email"];
    const name = payload["name"];
    const picture = payload["picture"];

    const isValidDomain = domain => auth.google.allowedDomains.includes(domain);

    if (!isValidDomain(domain) || isEmpty(domain)) {
      res.status(401).send("Unauthorized domain");
    }

    // Check if user exists
    let { User } = req.app.models;

    let user = await User.findOne({
      where: { email }
    });

    return res.send(ticket);
  } catch (err) {
    console.error("Error on Google Login", err);
    if (
      err.errors != null &&
      err.errors.length &&
      err.errors[0].type === "unique violation" &&
      err.errors[0].path === "email"
    ) {
      return res.status(403).send({ message: "Email in use" });
    } else if (err) return res.status(500).send(err);
  }
});

module.exports = {
  googleAuthRouter
};
