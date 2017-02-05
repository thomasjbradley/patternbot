'use strict';

const {app, dialog, shell} = require('electron');
const is = require('electron-is');

const commands = {
  'app:patternbot-license': function (menuItem, win) {
    shell.openExternal('https://github.com/thomasjbradley/patternbot/blob/master/LICENSE');
  },

  'app:patternbot-website': function (menuItem, win) {
    shell.openExternal('https://github.com/thomasjbradley/patternbot/');
  },

  'app:patternbot-support': function (menuItem, win) {
    shell.openExternal('https://github.com/thomasjbradley/patternbot/issues/');
  },

  'app:send-feedback': function (menuItem, win) {
    shell.openExternal('mailto:hey@thomasjbradley.ca');
  },
};

module.exports = require(__dirname + '/../menu-helper')(commands);
