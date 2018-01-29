'use strict';

const fs = require('fs');
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
      fs.writeFileSync(`${folderpath}/${file}`, fs.readFileSync(`${markbotFolders.root}/${file}`));
    });

    resolve();
  });
};

const copyCommon = function (folderpath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(`${folderpath}${appPkg.config.commonFolder}`)) return resolve();

    markbotFiles.forEach((file) => {
      fs.writeFileSync(`${folderpath}${appPkg.config.commonFolder}/${file}`, fs.readFileSync(`${markbotFolders.common}/${file}`));
    });

    resolve();
  });
};

const copyImages = function (folderpath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(`${folderpath}${appPkg.config.imagesFolder}`)) return resolve();

    markbotFiles.forEach((file) => {
      fs.writeFileSync(`${folderpath}${appPkg.config.imagesFolder}/${file}`, fs.readFileSync(`${markbotFolders.images}/${file}`));
    });

    resolve();
  });
};

const copyPages = function (folderpath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(`${folderpath}${appPkg.config.pagesFolder}`)) return resolve();

    markbotFiles.forEach((file) => {
      fs.writeFileSync(`${folderpath}${appPkg.config.pagesFolder}/${file}`, fs.readFileSync(`${markbotFolders.pages}/${file}`));
    });

    resolve();
  });
};

const copyPatterns = function (folderpath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(`${folderpath}${appPkg.config.patternsFolder}`)) return resolve();

    markbotFiles.forEach((file) => {
      fs.writeFileSync(`${folderpath}${appPkg.config.patternsFolder}/${file}`, fs.readFileSync(`${markbotFolders.patterns}/${file}`));
    });

    resolve();
  });
};

const copyUserPatterns = function (patterns) {
  return new Promise((resolve, reject) => {
    Promise.all(patterns.map((pattern) => {
      return new Promise((res, rej) => {
        markbotFiles.forEach((file) => {
          fs.writeFileSync(`${pattern}/${file}`, fs.readFileSync(`${markbotFolders.patternsSingle}/${file}`));
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
