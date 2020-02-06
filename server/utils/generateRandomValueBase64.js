const crypto = require('crypto')

function generateRandomValueBase64(length) {
  return crypto
    .randomBytes(Math.ceil((length * 3) / 4))
    .toString('base64').slice(0, length)
    .replace(/\+/g, '0')
    .replace(/\//g, '0')
}

module.exports = generateRandomValueBase64;