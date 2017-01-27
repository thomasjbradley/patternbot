'use strict';

const moduleParser = require(__dirname + '/module-parser');

const renderAll = function (allModules) {
  return new Promise(function (resolve, reject) {
    Promise
      .all(allModules.map(moduleParser))
      .then(function (modules) {
        resolve(modules);
      })
    ;
  });
};

module.exports = {
  renderAll: renderAll,
};
