'use strict';

const fs = require('fs');
const fse = require('fs-extra');
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

const listAll = function (builtin) {
  return fs.readdirSync(getPath(builtin)).filter(function (file) {
    return !(file.match(/^\./));
  });
};

const copy = function (folderpath, builtin, opts) {
  const patterns = listAll(builtin);
  const folder = `${folderpath}/${appPkg.config.patternsFolder}/${builtin}`;
  const templateDefaults = {
    modulifier: false,
    gridifier: false,
    typografier: false,
    fontUrl: false,
    theme: false,
  };

  if (typeof opts === 'undefined') opts = {};

  fse.emptyDirSync(folder);

  patterns.forEach(function (file) {
    let templateData = merge(templateDefaults, opts);

    templateData.pattern = fs.readFileSync(getPath(builtin, file), 'utf8');
    fse.outputFileSync(`${folder}/${file}`, templateHelper.render(`${builtin}.html`, templateData));
  });

  fse.copySync(`${templateHelper.TEMPLATE_FOLDER}/${DO_NOT_CHANGE_FILENAME}`, `${folder}/${DO_NOT_CHANGE_FILENAME}`);
};

module.exports = {
  getPath: getPath,
  copy: copy,
};
