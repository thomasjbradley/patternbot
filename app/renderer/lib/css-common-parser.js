'use strict';

const env = process.env.NODE_ENV;
const DEBUG = !!(env === 'development');

const modulifierParser = require(`${__dirname}/modulifier-parser`);
const gridifierParser = require(`${__dirname}/gridifier-parser`);
const typografierParser = require(`${__dirname}/typografier-parser`);
const cssVariableExtractor = require(`${__dirname}/css-variable-extractor`);

const defaultCommonCss = {
  modulifier: undefined,
  modulifierUrl: undefined,
  gridifier: undefined,
  gridifierUrl: undefined,
  typografier: undefined,
  typografierUrl: undefined,
  theme: undefined,
};

const parseAll = function (patternLibFiles, readme) {
  return new Promise((resolve, reject) => {
    Promise.all([
      modulifierParser.parse(patternLibFiles.commonParsable.modulifier),
      gridifierParser.parse(patternLibFiles.commonParsable.gridifier),
      typografierParser.parse(patternLibFiles.commonParsable.typografier),
      cssVariableExtractor.parse(patternLibFiles.commonParsable.theme, readme),
    ]).then((all) => {
      resolve({
        modulifier: all[0].settings,
        modulifierUrl: all[0].url,
        gridifier: all[1].settings,
        gridifierUrl: all[1].url,
        typografier: all[2].settings,
        typografierUrl: all[2].url,
        theme: all[3],
      });
    }).catch((e) => {
      if (DEBUG) console.log('CSS common parser error', e);
      resolve(defaultCommonCss);
    });
  });
};

module.exports = {
  parseAll: parseAll,
};
