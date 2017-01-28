'use strict';

const patternParser = require(__dirname + '/pattern-parser');

const renderAll = function (allPatterns) {
  return new Promise(function (resolve, reject) {
    Promise
      .all(allPatterns.map(patternParser))
      .then(function (patterns) {
        resolve(patterns);
      })
    ;
  });
};

module.exports = {
  renderAll: renderAll,
};
