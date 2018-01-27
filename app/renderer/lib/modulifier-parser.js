'use strict';

const webDevToolSettingsExtractor = require(`${__dirname}/web-dev-tool-settings-extractor`);

const parseSettings = function (settingsString) {
  return settingsString.split(/\;/);
};

const parse = function (filepath) {
  return new Promise(function (resolve, reject) {
    if (!filepath) return resolve(false);

    fs.readFile(filepath, 'utf8', function (err, data) {
      let settingsString = webDevToolSettingsExtractor.extractFrom(data, 'modulifier');

      if (!settingsString) return resolve(false);

      resolve({
        url: settingsString,
        settings: parseSettings(settingsString),
      });
    });
  });
};

module.exports = {
  parse: parse,
};
