'use strict';

const { restApiRoot } = require('./config.local');
const middleware = require('./middleware.json');

middleware.parse['body-parser#raw'].paths = [
  `${restApiRoot}/Users/slack/oauth20`
];

module.exports = middleware;
