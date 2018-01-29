'use strict';

const fs = require('fs');
const rimraf = require('rimraf');
const mkdirp = require('mkdirp');
const glob = require('glob');
const path = require('path');
const merge = require('merge-objects');

const templateHelper = require(`${__dirname}/template-helper`);
const patternsFolder = path.resolve(`${__dirname}/../patterns`);
const patternsCommonFolder = path.resolve(`${__dirname}/../patterns-common`);

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

const copyFilesByExtension = function (builtin, folderpath, ext) {
  let inpath = getPath(builtin);
  let files = listAll(builtin, ext);

  if (!files) return;

  files.forEach(function (file) {
    let filename = path.parse(file).base;

    fs.writeFileSync(`${folderpath}/${filename}`, fs.readFileSync(file));
  });
};

const copyCommonFiles = function (builtin, folderpath) {
  let files = glob.sync(`${patternsCommonFolder}/*`);

  if (!files) return;

  files.forEach(function (file) {
    let filename = path.parse(file);

    if(filename.ext === '.css' && !filename.base.match(/\.min\.css$/)) return;

    fs.writeFileSync(`${folderpath}/${filename.base}`, fs.readFileSync(file));
  });
};

const getLimiters = function (builtin, commonInfo) {
  return require(`${__dirname}/${builtin}-limiter-generator`)(commonInfo);
};

const copy = function (folderpath, builtin, commonFiles, commonInfo, limiter) {
  const patterns = listAll(builtin);
  const folder = `${folderpath}/${appPkg.config.patternsFolder}/${builtin}`;

  rimraf.sync(folder);
  mkdirp.sync(folder);

  patterns.forEach(function (file) {
    let templateData = {
      commonFiles: commonFiles,
      commonInfo: commonInfo,
    };
    let patternData;
    let filename;

    if (limiter && limiter.indexOf(path.parse(file).name.replace(/^[\d-]*/, '')) <= -1) return;

    patternData = fs.readFileSync(file, 'utf8');
    filename = path.parse(file).base;

    templateData.pattern = templateHelper.renderString(patternData, templateData);

    fs.writeFileSync(`${folder}/${filename}`, templateHelper.render(`${builtin}.html`, templateData));
  });

  copyFilesByExtension(builtin, folder, '.min.css');
  copyFilesByExtension(builtin, folder, '.svg');
  copyCommonFiles(builtin, folder);
};

module.exports = {
  getPath: getPath,
  copy: copy,
  getLimiters: getLimiters,
};
