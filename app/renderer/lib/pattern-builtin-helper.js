'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const glob = require('glob');
const path = require('path');
const merge = require('merge-objects');

const templateHelper = require(`${__dirname}/template-helper`);
const patternsFolder = path.resolve(`${__dirname}/../patterns`);

const DO_NOT_CHANGE_FILENAME = 'DO-NOT-CHANGE.txt';
let appPkg = require(`${__dirname}/../../../package.json`);

const getPath = function (builtin, file) {
  if (typeof file === 'undefined') {
    return path.resolve(`${patternsFolder}/${builtin}`);
  } else {
    return path.resolve(`${patternsFolder}/${builtin}/${file}`);
  }
};

const listAll = function (builtin, extension) {
  let inpath = getPath(builtin);
  let ext = (typeof extension === 'undefined') ? '.html': extension;

  return glob.sync(`${inpath}/*${ext}`);
};

const copyCssFiles = function (builtin, outpath) {
  let inpath = getPath(builtin);
  let files = listAll(builtin, '.min.css');

  if (!files) return;

  files.forEach(function (file) {
    let filename = path.parse(file).base;

    fse.copySync(file, `${outpath}/${filename}`)
  });
};

const copy = function (folderpath, builtin, commonFiles, commonInfo) {
  const patterns = listAll(builtin);
  const folder = `${folderpath}/${appPkg.config.patternsFolder}/${builtin}`;
  const commonFilesDefaults = {
    modulifier: false,
    gridifier: false,
    typografier: false,
    fontUrl: false,
    theme: false,
  };

  if (typeof commonFiles === 'undefined') commonFiles = {};

  fse.emptyDirSync(folder);

  patterns.forEach(function (file) {
    let templateData = {
      commonFiles: merge(commonFilesDefaults, commonFiles),
      commonInfo: commonInfo,
    };
    let patternData = fs.readFileSync(file, 'utf8')
    let filename = path.parse(file).base;

    templateData.pattern = templateHelper.renderString(patternData, templateData);
    fse.outputFileSync(`${folder}/${filename}`, templateHelper.render(`${builtin}.html`, templateData));
  });

  copyCssFiles(builtin, folder);
  fse.copySync(`${templateHelper.TEMPLATE_FOLDER}/${DO_NOT_CHANGE_FILENAME}`, `${folder}/${DO_NOT_CHANGE_FILENAME}`);
};

module.exports = {
  getPath: getPath,
  copy: copy,
};
