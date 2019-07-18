const { restApiRoot } = require("../../config.local");

module.exports = str => `${restApiRoot}${str}`;
