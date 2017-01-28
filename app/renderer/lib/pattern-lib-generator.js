'use strict';

const templateHelper = require(__dirname + '/template-helper');
const patternParserQueue = require(__dirname + '/pattern-parser-queue');
const patternRenderer = require(__dirname + '/pattern-renderer');

const generate = function (patternLibFiles) {
  return new Promise(function (resolve, reject) {
    Promise.all([
      patternParserQueue.renderAll(patternLibFiles.patterns),
    ]).then(function (all) {
      let renderedPatterns = patternRenderer.renderAll(all[0]);
      console.log(renderedPatterns);
    });
  });
};

module.exports = {
  generate: generate,
};
