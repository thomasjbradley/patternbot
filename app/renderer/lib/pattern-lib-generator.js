'use strict';

const fs = require('fs');
const path = require('path');

const templateHelper = require(`${__dirname}/template-helper`);
const cssCommonParser = require(`${__dirname}/css-common-parser`);
const builtInHelper = require(`${__dirname}/pattern-builtin-helper`);
const patternParserQueue = require(`${__dirname}/pattern-parser-queue`);
const patternRenderer = require(`${__dirname}/pattern-renderer`);

let appPkg = require(`${__dirname}/../../../package.json`);

const getDefaultPatterLibInfo = function (patternLibFiles) {
  return {
    patterns: [],
  };
};

const renderPatternLib = function (patternLibFiles, patternLibInfo, commonInfo) {
  return templateHelper.render('pattern-library.html', {
    files: patternLibFiles,
    patterns: patternLibInfo.patterns,
    common: commonInfo,
  });
};

const savePatternLib = function (folderpath, patternLibString) {
  fs.writeFileSync(`${folderpath}/${appPkg.config.patternLibFilename}`, patternLibString);
};

const generate = function (folderpath, patternLibFiles) {
  return new Promise(function (resolve, reject) {
    Promise.all([
      cssCommonParser.parseAll(patternLibFiles),
      patternParserQueue.parseAllBuiltins('brand'),
      patternParserQueue.parseAllBuiltins('typography'),
      // iconsParser.parseAll(patterLibFiles),
      patternParserQueue.parseAll(patternLibFiles.patterns),
    ]).then(function (all) {
      let patternLibInfo = getDefaultPatterLibInfo(patternLibFiles);

      let commonInfo = all[0];
      let brandPatterns = all[1];
      let typographyPatterns = all[2];
      let userPatterns = all[3];

      if (commonInfo.theme && brandPatterns.length && patternLibFiles.commonParsable.theme) {
        patternLibInfo.patterns = patternLibInfo.patterns.concat(patternRenderer.renderAll(brandPatterns, {hideCode: true, hideNav: true}));
        builtInHelper.copy(folderpath, 'brand', patternLibFiles.commonParsable, commonInfo);
      }

      if (commonInfo.typografier && typographyPatterns.length && patternLibFiles.commonParsable.typografier) {
        patternLibInfo.patterns = patternLibInfo.patterns.concat(patternRenderer.renderAll(typographyPatterns, {hideCode: true, hideNav: true}));
        builtInHelper.copy(folderpath, 'typography', patternLibFiles.commonParsable, commonInfo);
      }

      if (userPatterns.length) patternLibInfo.patterns = patternLibInfo.patterns.concat(patternRenderer.renderAll(userPatterns));

      savePatternLib(folderpath, renderPatternLib(patternLibFiles, patternLibInfo, commonInfo));
      resolve();
    });
  });
};

module.exports = {
  generate: generate,
};
