module.exports = {
  app: {
    admin: {
      name: process.env.APP_ADMIN_NAME,
      email: process.env.APP_ADMIN_EMAIL,
      password: process.env.APP_ADMIN_PASSWORD
    }
  }
  config: {
    email: {
      from_address:
        process.env.EMAIL_FROM_ADDRESS || "MyApp <no-reply@example.com>",
      auth: {
        api_key: process.env.EMAIL_API_KEY || "(your mailgun api key)",
        domain: process.env.EMAIL_DOMAIN || "(your mailgun domain)"
      }
    },
    auth: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        allowedDomains: [
          "prompto.io",
          "ksquareinc.com",
          "infolob.com",
          "scouting.org",
          "gmail.com"
        ]
      }
    },
    serviceAccount: {
      key:
        process.env.KEY_SERVICE_ACCOUNT.replace(/\\n/g, "\n") ||
        "The key must be in file .env",
      serviceAcctId: process.env.SERVICE_ACCOUNT,
      timezone: process.env.TIMEZONE || "UTC-05:00"
    }
  }
};
