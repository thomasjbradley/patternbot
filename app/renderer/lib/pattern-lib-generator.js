'use strict';

const fs = require('fs');
const handlebars = require('handlebars');
const templateHelper = require(__dirname + '/template-helper');
const moduleParserQueue = require(__dirname + '/module-parser-queue');

const generate = function (patternLibFiles) {
  return new Promise(function (resolve, reject) {
    Promise.all([
      moduleParserQueue.renderAll(patternLibFiles.elements),
      moduleParserQueue.renderAll(patternLibFiles.components),
    ]).then(function (all) {
      console.log(all);
    });
  });
};

module.exports = {
  generate: generate,
};
