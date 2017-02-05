'use strict';

const fs = require('fs');
const path = require('path');

const readmeParser = require(`${__dirname}/readme-parser`);
const optimizedAssetsReader = require(`${__dirname}/optimized-assets-reader`);
const templateHelper = require(`${__dirname}/template-helper`);
const cssCommonParser = require(`${__dirname}/css-common-parser`);
const builtInHelper = require(`${__dirname}/pattern-builtin-helper`);
const patternParserQueue = require(`${__dirname}/pattern-parser-queue`);
const patternRenderer = require(`${__dirname}/pattern-renderer`);
const iconParser = require(`${__dirname}/icon-parser`);

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
    cssCommonParser.parseAll(patternLibFiles).then(function (commonInfo) {
      Promise.all([
        readmeParser.parse(folderpath),
        optimizedAssetsReader.readAll(),
        patternParserQueue.parseAllBuiltins('brand'),
        patternParserQueue.parseAllBuiltins('typography'),
        patternParserQueue.parseAllBuiltins('grid'),
        patternParserQueue.parseAllBuiltins('modules', commonInfo.modulifier),
        iconParser.parseAll(patternLibFiles.imagesParsable.icons),
        patternParserQueue.parseAllBuiltins('icons'),
        patternParserQueue.parseAll(patternLibFiles.patterns),
      ]).then(function (all) {
        let patternLibInfo = getDefaultPatterLibInfo(patternLibFiles);

        let readme = all[0];
        let assets = all[1];
        let brandPatterns = all[2];
        let typePatterns = all[3];
        let gridPatterns = all[4];
        let modulePatterns = all[5];
        let icons = all[6];
        let iconsPatterns = all[7];
        let userPatterns = all[8];

        if (readme) commonInfo.readme = readme;
        if (assets) commonInfo.assets = assets;
        if (icons) commonInfo.icons = icons;

        if (commonInfo.theme && brandPatterns.length && patternLibFiles.commonParsable.theme) {
          patternLibInfo.patterns = patternLibInfo.patterns.concat(patternRenderer.renderAll(brandPatterns, {hideCode: true, hideNav: true}));
          builtInHelper.copy(folderpath, 'brand', patternLibFiles, commonInfo);
        }

        if (commonInfo.typografier && typePatterns.length && typePatterns[0].html.length && patternLibFiles.commonParsable.typografier) {
          patternLibInfo.patterns = patternLibInfo.patterns.concat(patternRenderer.renderAll(typePatterns, {hideCode: true, hideNav: true}));
          builtInHelper.copy(folderpath, 'typography', patternLibFiles, commonInfo);
        }

        if (commonInfo.gridifier && gridPatterns.length && gridPatterns[0].html.length && patternLibFiles.commonParsable.gridifier) {
          patternLibInfo.patterns = patternLibInfo.patterns.concat(patternRenderer.renderAll(gridPatterns, {hideCode: true, hideNav: true}));
          builtInHelper.copy(folderpath, 'grid', patternLibFiles, commonInfo);
        }

        if (commonInfo.modulifier && modulePatterns.length && modulePatterns[0].html.length && patternLibFiles.commonParsable.modulifier) {
          patternLibInfo.patterns = patternLibInfo.patterns.concat(patternRenderer.renderAll(modulePatterns, {hideNav: true}));
          builtInHelper.copy(folderpath, 'modules', patternLibFiles, commonInfo, commonInfo.modulifier);
        }

        if (icons.length && iconsPatterns.length && iconsPatterns[0].html.length && patternLibFiles.imagesParsable.icons) {
          patternLibInfo.patterns = patternLibInfo.patterns.concat(patternRenderer.renderAll(iconsPatterns, {hideNav: true}));
          builtInHelper.copy(folderpath, 'icons', patternLibFiles, commonInfo);
        }

        if (userPatterns.length) patternLibInfo.patterns = patternLibInfo.patterns.concat(patternRenderer.renderAll(userPatterns));

        savePatternLib(folderpath, renderPatternLib(patternLibFiles, patternLibInfo, commonInfo));
        resolve();
      });
    });
  });
};

module.exports = {
  generate: generate,
};
