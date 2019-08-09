'use strict';

const { jwtAlgo, jwtSecret, auth: { slack: { clientSecret } } } = require('../config.local.js');
const { verify, sign } = require('jsonwebtoken');

class jwtService {

  async isValid(jwtToken) {
    return new Promise((resolve, reject) => {

      verify(jwtToken, jwtSecret, {
        algorithms: [jwtAlgo]
      }, (err, payload) => {

        if (err) {
          return reject(err);
        }

        resolve(payload);

      });

    });
  }

  async make({ id }, expiresIn = "7 days") {
    return new Promise((resolve, reject) => {

      sign({ id }, jwtSecret, {
        algorithm: jwtAlgo,
        expiresIn
      }, (err, token) => {

        if (err) {
          return reject(err);
        }

        resolve(token);

      });

    });
  }

}

module.exports = new jwtService;
