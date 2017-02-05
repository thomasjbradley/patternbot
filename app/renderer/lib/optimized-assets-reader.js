'use strict';

const fs = require('fs');
const path = require('path');
const promisify = require('es6-promisify');
const readFile = promisify(fs.readFile);

const assetsFolder = path.resolve(`${__dirname}/../pattern-lib-assets`);

const readAll = function () {
  return new Promise((resolve, reject) => {
    Promise.all([
      readFile(`${assetsFolder}/pattern-lib.min.css`, 'utf8'),
      readFile(`${assetsFolder}/pattern-lib.min.js`, 'utf8'),
    ]).then((all) => {
      resolve({
        css: all[0],
        js: all[1],
      })
    });
  });
}

module.exports = {
  readAll: readAll,
};
