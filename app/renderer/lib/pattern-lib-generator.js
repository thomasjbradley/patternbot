'use strict';

const templateHelper = require(__dirname + '/template-helper');
const patternParserQueue = require(__dirname + '/pattern-parser-queue');
const patternRenderer = require(__dirname + '/pattern-renderer');

const renderPatternLib = function (patternLibInfo) {
  return templateHelper.render('pattern-library.html', patternLibInfo);
};

const generate = function (patternLibFiles) {
  return new Promise(function (resolve, reject) {
    Promise.all([
      patternParserQueue.renderAll(patternLibFiles.patterns),
    ]).then(function (all) {
      resolve(renderPatternLib({
        patterns: patternRenderer.renderAll(all[0]),
      }));
    });
  });
};

module.exports = {
  generate: generate,
};
