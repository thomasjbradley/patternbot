'use strict';

const fs = require('fs');

const webDevToolSettingsExtractor = require(`${__dirname}/web-dev-tool-settings-extractor`);

const settingsDefaults = {
  mq: false,
  fontSize: false,
  lineHeight: false,
  scale: false,
};

const parseSettings = function (settingsString) {
  let settingsBits = settingsString.split(/\;/);
  let settings = [];

  settingsBits.forEach(function (mqString) {
    let mqBits = mqString.split(/\,/);
    let mq = Object.assign({}, settingsDefaults);

    mq.mq = parseFloat(mqBits[0]);
    mq.fontSize = parseFloat(mqBits[1]);
    mq.lineHeight = parseFloat(mqBits[2]);
    mq.scale = parseFloat(mqBits[3]);

    settings.push(mq);
  });

  return settings;
};

const parse = function (filepath) {
  return new Promise(function (resolve, reject) {
    if (!filepath) return resolve(false);

    fs.readFile(filepath, 'utf8', function (err, data) {
      let settingsString = webDevToolSettingsExtractor.extractFrom(data);

      if (!settingsString) return resolve(false);

      resolve(parseSettings(settingsString));
    });
  });
};

module.exports = {
  parse: parse,
};
