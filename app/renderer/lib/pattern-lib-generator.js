'use strict';

const fs = require('fs');
const path = require('path');

const templateHelper = require(__dirname + '/template-helper');
const patternParserQueue = require(__dirname + '/pattern-parser-queue');
const patternRenderer = require(__dirname + '/pattern-renderer');
const builtInHelper = require(__dirname + '/pattern-builtin-helper');

let appPkg = require(__dirname + '/../../../package.json');

const getDefaultPatterLibInfo = function (patternLibFiles) {
  return {
    patterns: [],
  };
};

const getBuiltinOpts = function (patternLibFiles) {
  return {
    modulifier: (patternLibFiles.commonParsable.moduifier),
    gridifier: (patternLibFiles.commonParsable.gridifier),
    typografier: (patternLibFiles.commonParsable.typografier),
    theme: (patternLibFiles.commonParsable.theme),
  };
};

const renderPatternLib = function (patternLibInfo) {
  return templateHelper.render('pattern-library.html', patternLibInfo);
};

const savePatternLib = function (folderpath, patternLibString) {
  fs.writeFileSync(`${folderpath}/${appPkg.config.patternLibFilename}`, patternLibString);
};

const generate = function (folderpath, patternLibFiles) {
  return new Promise(function (resolve, reject) {
    Promise.all([
      // cssCommonParser.parseAll(patternLibFiles),
      patternParserQueue.parseAllBuiltins('typography'),
      // imagesParser.parseAll(patterLibFiles),
      patternParserQueue.parseAll(patternLibFiles.patterns),
    ]).then(function (all) {
      let patternLibInfo = getDefaultPatterLibInfo(patternLibFiles);
      let builtinOpts = getBuiltinOpts(patternLibFiles);

      if (all[0].length) {
        patternLibInfo.patterns = patternLibInfo.patterns.concat(patternRenderer.renderAll(all[0], {hideCode: true}));
        builtInHelper.copy(folderpath, 'typography', builtinOpts);
      }

      if (all[1].length) patternLibInfo.patterns = patternLibInfo.patterns.concat(patternRenderer.renderAll(all[1]));

      savePatternLib(folderpath, renderPatternLib(patternLibInfo));
      resolve();
    });
  });
};

module.exports = {
  generate: generate,
};
