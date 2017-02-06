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
        modulifier: all[0],
        gridifier: all[1],
        typografier: all[2],
        theme: all[3],
      });
    });
  });
};

module.exports = {
  parseAll: parseAll,
};
