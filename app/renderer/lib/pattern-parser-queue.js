'use strict';

const fs = require('fs');
const path = require('path');
const patternParser = require(`${__dirname}/pattern-parser`);
const builtInHelper = require(`${__dirname}/pattern-builtin-helper`);

const parseAll = function (allPatterns) {
  return new Promise(function (resolve, reject) {
    Promise
      .all(allPatterns.map(patternParser))
      .then(function (patterns) {
        resolve(patterns.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        }));
      })
    ;
  });
};

const parseAllBuiltins = function (pattern) {
  return parseAll([builtInHelper.getPath(pattern)]);
};

module.exports = {
  parseAll: parseAll,
  parseAllBuiltins: parseAllBuiltins,
};
