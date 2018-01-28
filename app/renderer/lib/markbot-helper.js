'use strict';

const fse = require('fs-extra');
const appPkg = require(`${__dirname}/../../../package.json`);

const markbotFiles = [
  '.markbot.yml',
  '.markbotignore',
];

const markbotFolders = {
  root: `${__dirname}/../markbot/root`,
  common: `${__dirname}/../markbot/common`,
  images: `${__dirname}/../markbot/images`,
  pages: `${__dirname}/../markbot/pages`,
  patterns: `${__dirname}/../markbot/patterns`,
  patternsSingle: `${__dirname}/../markbot/patterns-single`,
};

const copyRoot = function (folderpath) {
  return new Promise((resolve, reject) => {
    markbotFiles.forEach((file) => {
      fse.copySync(`${markbotFolders.root}/${file}`, `${folderpath}/${file}`);
    });

    resolve();
  });
};

const copyCommon = function (folderpath) {
  return new Promise((resolve, reject) => {
    if (!fse.pathExistsSync(`${folderpath}${appPkg.config.commonFolder}`)) return resolve();

    markbotFiles.forEach((file) => {
      fse.copySync(`${markbotFolders.common}/${file}`, `${folderpath}${appPkg.config.commonFolder}/${file}`);
    });

    resolve();
  });
};

const copyImages = function (folderpath) {
  return new Promise((resolve, reject) => {
    if (!fse.pathExistsSync(`${folderpath}${appPkg.config.imagesFolder}`)) return resolve();

    markbotFiles.forEach((file) => {
      fse.copySync(`${markbotFolders.images}/${file}`, `${folderpath}${appPkg.config.imagesFolder}/${file}`);
    });

    resolve();
  });
};

const copyPages = function (folderpath) {
  return new Promise((resolve, reject) => {
    if (!fse.pathExistsSync(`${folderpath}${appPkg.config.pagesFolder}`)) return resolve();

    markbotFiles.forEach((file) => {
      fse.copySync(`${markbotFolders.pages}/${file}`, `${folderpath}${appPkg.config.pagesFolder}/${file}`);
    });

    resolve();
  });
};

const copyPatterns = function (folderpath) {
  return new Promise((resolve, reject) => {
    if (!fse.pathExistsSync(`${folderpath}${appPkg.config.patternsFolder}`)) return resolve();

    markbotFiles.forEach((file) => {
      fse.copySync(`${markbotFolders.patterns}/${file}`, `${folderpath}${appPkg.config.patternsFolder}/${file}`);
    });

    resolve();
  });
};

const copyUserPatterns = function (patterns) {
  return new Promise((resolve, reject) => {
    Promise.all(patterns.map((pattern) => {
      return new Promise((res, rej) => {
        markbotFiles.forEach((file) => {
          fse.copySync(`${markbotFolders.patternsSingle}/${file}`, `${pattern}/${file}`);
        });

        res();
      });
    })).then(resolve);
  });
};

const copyAll = function (folderpath, patternLibFiles) {
  return new Promise((resolve, reject) => {
    Promise.all([
      copyRoot(folderpath),
      copyCommon(folderpath),
      copyImages(folderpath),
      copyPages(folderpath),
      copyPatterns(folderpath),
      copyUserPatterns(patternLibFiles.patterns),
    ]).then(resolve);
  });
};

module.exports = {
  copyAll: copyAll,
};
