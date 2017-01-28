'use strict';

const templateHelper = require(__dirname + '/template-helper');
const moduleParserQueue = require(__dirname + '/module-parser-queue');
const moduleRenderer = require(__dirname + '/module-renderer');

const generate = function (patternLibFiles) {
  return new Promise(function (resolve, reject) {
    Promise.all([
      moduleParserQueue.renderAll(patternLibFiles.elements),
      moduleParserQueue.renderAll(patternLibFiles.components),
    ]).then(function (all) {
      let renderedElements = moduleRenderer.renderAll(all[0]);
      let renderedComponents = moduleRenderer.renderAll(all[1]);
    });
  });
};

module.exports = {
  generate: generate,
};
