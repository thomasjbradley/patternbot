'use strict';

const fs = require('fs');
const path = require('path');
const patternParser = require(`${__dirname}/pattern-parser`);
const builtInHelper = require(`${__dirname}/pattern-builtin-helper`);

const parseAll = function (allPatterns, limiter) {
  return new Promise(function (resolve, reject) {
    Promise
      .all(allPatterns.map((folderpath) => patternParser(folderpath, limiter)))
      .then(function (patterns) {
        resolve(patterns.sort(function (a, b) {
          return a.name.localeCompare(b.name);
        }));
      })
    ;
  });
};

const parseAllBuiltins = function (pattern, limiter) {
  return parseAll([builtInHelper.getPath(pattern)], limiter);
};

module.exports = {
  parseAll: parseAll,
  parseAllBuiltins: parseAllBuiltins,
};
