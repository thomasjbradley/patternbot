'use strict';

const modulifierParser = require(`${__dirname}/modulifier-parser`);
const gridifierParser = require(`${__dirname}/gridifier-parser`);
const typografierParser = require(`${__dirname}/typografier-parser`);
const cssVariableExtractor = require(`${__dirname}/css-variable-extractor`);

const parseAll = function (patternLibFiles, readme) {
  return new Promise(function (resolve, reject) {
    Promise.all([
      modulifierParser.parse(patternLibFiles.commonParsable.modulifier),
      gridifierParser.parse(patternLibFiles.commonParsable.gridifier),
      typografierParser.parse(patternLibFiles.commonParsable.typografier),
      cssVariableExtractor.parse(patternLibFiles.commonParsable.theme, readme),
    ]).then(function (all) {
      resolve({
        modulifier: all[0].settings,
        modulifierUrl: all[0].url,
        gridifier: all[1].settings,
        gridifierUrl: all[1].url,
        typografier: all[2].settings,
        typografierUrl: all[2].url,
        theme: all[3],
      });
    });
  });
};

module.exports = {
  parseAll: parseAll,
};
