'use strict';

const patternParser = require(__dirname + '/pattern-parser');

const renderAll = function (allPatterns) {
  return new Promise(function (resolve, reject) {
    Promise
      .all(allPatterns.map(patternParser))
      .then(function (pattern) {
        resolve(pattern);
      })
    ;
  });
};

module.exports = {
  renderAll: renderAll,
};
