'use strict';

const fs = require('fs');
const path = require('path');
const promisify = require('es6-promisify');
const subfiles = promisify(fs.readdir);
const fileExists = require(__dirname + '/../../shared/file-exists');

const appPkg = require(__dirname + '/../../../package.json');
let patternLibFiles = require(__dirname + '/pattern-lib-files');

const findParseableFile = function (folderpath, filepath, patternLibKey) {
  const keys = patternLibKey.split(/\./);

  return new Promise(function (resolve, reject) {
    patternLibFiles[keys[0]][keys[1]] = (fileExists.check(folderpath + filepath)) ? folderpath + filepath : false;
    resolve()
  });
};

const findSubDirectories = function (folderpath, subdir, patternLibKey) {
  return new Promise(function (resolve, reject) {
    subfiles(folderpath + subdir)
      .then(function (foundFiles) {
        let subdirs = foundFiles.filter(function (file) {
          return fs.statSync(path.join(folderpath + subdir, file)).isDirectory();
        });

        patternLibFiles[patternLibKey] = patternLibFiles[patternLibKey].concat(patternLibFiles[patternLibKey], subdirs.map(function (dir) {
          return path.resolve(folderpath + subdir + '/' + dir);
        }));

        resolve();
      })
      .catch(resolve)
    ;
  });
};

const find = function (folderpath) {
  return new Promise(function (resolve, reject) {
    Promise.all([
      findParseableFile(folderpath, appPkg.config.commonFolder + '/' + appPkg.config.commonParsableFilenames.modulifier, 'commonParsable.modulifier'),
      findParseableFile(folderpath, appPkg.config.commonFolder + '/' + appPkg.config.commonParsableFilenames.gridifier, 'commonParsable.gridifier'),
      findParseableFile(folderpath, appPkg.config.commonFolder + '/' + appPkg.config.commonParsableFilenames.typografier, 'commonParsable.typografier'),
      findParseableFile(folderpath, appPkg.config.commonFolder + '/' + appPkg.config.commonParsableFilenames.theme, 'commonParsable.theme'),
      findParseableFile(folderpath, appPkg.config.imagesFolder + '/' + appPkg.config.imagesParsableFilenames.icons, 'imagesParsable.icons'),
      findSubDirectories(folderpath, appPkg.config.elementsFolder, 'elements'),
      findSubDirectories(folderpath, appPkg.config.componentsFolder, 'components'),
      findSubDirectories(folderpath, appPkg.config.pagesFolder, 'pages'),
    ]).then(function () {
      resolve(patternLibFiles);
    });
  });
};

module.exports = {
  find: find,
};
