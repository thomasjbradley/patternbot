'use strict';

const fs = require('fs');
const path = require('path');
const S = require('string');
const glob = require('glob');
const {promisify} = require('es6-promisify');
const subfiles = promisify(fs.readdir);
const fileExists = require(`${__dirname}/../../shared/file-exists`);

const appPkg = require(`${__dirname}/../../../package.json`);
const patternLibFilesDefaults = require(`${__dirname}/pattern-lib-files`);

let patternLibFiles = {};
let ignorableFolders = [];

const getIgnorableFolders = function (builtInPatternsPath) {
  return new Promise((resolve, reject) => {
    subfiles(builtInPatternsPath).then((folders) => {
      folders.forEach((folder) => {
        if (/^\./.test(folder)) return;

        ignorableFolders.push(folder);
      });

      resolve(ignorableFolders);
    });
  });
};

const shouldIncludeDirectory = function (folderpath, file) {
  return (
    fs.statSync(path.join(folderpath, file)).isDirectory()
    && !ignorableFolders.includes(file)
  );
};

const findParseableFile = function (folderpath, filepath, patternLibKey) {
  return new Promise(function (resolve, reject) {
    const keys = patternLibKey.split(/\./);

    patternLibFiles[keys[0]][keys[1]] = (fileExists.check(folderpath + filepath)) ? folderpath + filepath : false;
    resolve()
  });
};

const findJavaScriptFiles = function (folderpath) {
  return new Promise((resolve, reject) => {
    glob(`${folderpath}/*.js`, (err, allJs) => {
      if (err) return resolve();

      allJs.forEach((js) => {
        if (/patternbot(\.min)?\.js$/.test(js)) return;
        patternLibFiles.js.push({
          path: js,
          filename: path.basename(js),
        });
      });

      patternLibFiles.js.sort();
      resolve();
    })
  });
}

const findLogos = function (folderpath, imagesFolder) {
  return new Promise(function (resolve, reject) {
    let logoSizes = {
      sizeLarge: false,
      size64: false,
      size32: false,
      size16: false,
    };
    const logoFilesExts = '(svg|png)';
    const logoFilesNames = '(logo|logo-256|logo-64|logo-32|logo-16)';
    const logoGlob = `${folderpath}${imagesFolder}/?${logoFilesNames}.?${logoFilesExts}`;

    glob(logoGlob, function (err, logos) {
      if (err) return resolve();

      logos.forEach(function (logo) {
        if (/logo(-256)?\./.test(logo)) {
          logoSizes.sizeLarge = logo;
          logoSizes.sizeLargeLocal = path.parse(logo).base;
        }

        if (/64\./.test(logo)) {
          logoSizes.size64 = logo;
          logoSizes.size64Local = path.parse(logo).base;
        }

        if (/32\./.test(logo)) {
          logoSizes.size32 = logo;
          logoSizes.size32Local = path.parse(logo).base;
        }

        if (/16\./.test(logo)) {
          logoSizes.size16 = logo;
          logoSizes.size16Local = path.parse(logo).base;
        }
      });

      patternLibFiles.logos = logoSizes;
      resolve();
    });
  });
};

const findSubDirectories = function (folderpath, subdir, patternLibKey) {
  return new Promise(function (resolve, reject) {
    subfiles(folderpath + subdir)
      .then(function (foundFiles) {
        let subdirs = foundFiles.filter(function (file) {
          return shouldIncludeDirectory(folderpath + subdir, file);
        });

        patternLibFiles[patternLibKey] = patternLibFiles[patternLibKey].concat(patternLibFiles[patternLibKey], subdirs.map(function (dir) {
          return path.resolve(`${folderpath}${subdir}/${dir}`);
        }));

        resolve();
      })
      .catch(resolve)
    ;
  });
};

const findSubFiles = function (folderpath, subdir, patternLibKey) {
  return new Promise(function (resolve, reject) {
    glob(`${folderpath}${subdir}/*.html`, function (err, files) {
      let pages = [];

      if (err) return resolve();

      files.forEach(function (file) {
        let filename = path.parse(file).base;
        let namePretty = S(filename.replace(/\.html/, '')).humanize().s;

        if (namePretty.toLowerCase() == 'index') namePretty = 'Home';

        pages.push({
          name: filename,
          namePretty: namePretty,
          path: file,
        });
      });

      patternLibFiles[patternLibKey] = pages;
      resolve();
    });
  });
};

const find = function (folderpath) {
  patternLibFiles = JSON.parse(JSON.stringify(patternLibFilesDefaults));

  return new Promise(function (resolve, reject) {
    Promise.all([
      getIgnorableFolders(`${__dirname}/../patterns`),
      findParseableFile(folderpath, `${appPkg.config.commonFolder}/${appPkg.config.commonParsableFilenames.modulifier}`, 'commonParsable.modulifier'),
      findParseableFile(folderpath, `${appPkg.config.commonFolder}/${appPkg.config.commonParsableFilenames.gridifier}`, 'commonParsable.gridifier'),
      findParseableFile(folderpath, `${appPkg.config.commonFolder}/${appPkg.config.commonParsableFilenames.typografier}`, 'commonParsable.typografier'),
      findParseableFile(folderpath, `${appPkg.config.commonFolder}/${appPkg.config.commonParsableFilenames.theme}`, 'commonParsable.theme'),
      findParseableFile(folderpath, `${appPkg.config.imagesFolder}/${appPkg.config.imagesParsableFilenames.icons}`, 'imagesParsable.icons'),
      findLogos(folderpath, appPkg.config.imagesFolder),
      findSubDirectories(folderpath, appPkg.config.patternsFolder, 'patterns'),
      findSubFiles(folderpath, appPkg.config.pagesFolder, 'pages'),
      findJavaScriptFiles(`${folderpath}/${appPkg.config.commonFolder}`),
    ]).then(function () {
      resolve(patternLibFiles);
    });
  });
};

module.exports = {
  find: find,
};
