module.exports = {
  config: {
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
    }
  }
};
