const { env } = process;
module.exports = {
  app: {
    admin: {
      name: env.APP_ADMIN_NAME,
      email: env.APP_ADMIN_EMAIL,
      password: env.APP_ADMIN_PASSWORD
    }
  },
  config: {
    email: {
      from_address: env.EMAIL_FROM_ADDRESS || "MyApp <no-reply@example.com>",
      auth: {
        api_key: env.EMAIL_API_KEY || "(your mailgun api key)",
        domain: env.EMAIL_DOMAIN || "(your mailgun domain)"
      }
    },
    auth: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        allowedDomains: [
          "prompto.io",
          "ksquareinc.com",
          "infolob.com",
          "scouting.org",
          "gmail.com"
        ]
      },
      slack: {
        clientId: env.SLACK_CLIENT_ID,
        clientSecret: env.SLACK_CLIENT_SECRET,
        accessToken: env.SLACK_ACCESS_TOKEN,
        signingSecret: env.SLACK_SIGNING_SECRET,
        apiUri: env.SLACK_API_URI,
        oauthUri: env.SLACK_OAUTH_URI,
        redirectUri: env.SLACK_OAUTH_REDIRECT_URI
      }
    },
    serviceAccount: {
      key:
        env.KEY_SERVICE_ACCOUNT.replace(/\\n/g, "\n") ||
        "The key must be in file .env",
      serviceAcctId: env.SERVICE_ACCOUNT,
      timezone: env.TIMEZONE || "UTC-05:00"
    }
  }
};
