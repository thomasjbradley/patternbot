'use strict';

const webDevToolSettingsExtractor = require(`${__dirname}/web-dev-tool-settings-extractor`);

const settingsDefaults = {
  prefix: false,
  columns: false,
  mq: false,
};

const parseSettings = function (settingsString) {
  let settingsBits = settingsString.split(/\;/);
  let settings = [];

  settingsBits.forEach(function (mqString) {
    let mqBits = mqString.split(/\,/);
    let mq = Object.assign({}, settingsDefaults);

    mq.prefix = mqBits[0];
    mq.columns = parseFloat(mqBits[1]);
    mq.mq = parseFloat(mqBits[2]);

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
