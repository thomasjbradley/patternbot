'use strict';

const fs = require('fs');
const path = require('path');
const dir = require('node-dir');
const S = require('string');
const classify = require(`${__dirname}/../../shared/classify`);
const htmlFileParser = require(`${__dirname}/html-file-parser`);
const markdownFileParser = require(`${__dirname}/markdown-file-parser`);

const patternInfoDefaults = {
  name: '',
  namePretty: '',
  path: '',
  html: {},
  md: {},
};

const formatName = function (name) {
  return classify(name).replace(/^\d*-?/, '');
};

const getModuleNameFromPath = function (folderpath) {
  return path.parse(folderpath).name;
};

const getLocalPath = function (folderpath, filepath) {
  return folderpath.split(/[\/\\]/).slice(-2).join('/') + '/' + path.parse(filepath).base;
};

const readFile = function (filepath) {
  return new Promise(function (resolve, reject) {
    let theFilePath = filepath.slice(0);

    fs.readFile(theFilePath, 'utf8', function (err, data) {
      let name = formatName(path.parse(theFilePath).name);

      resolve({
        name: name,
        namePretty: S(name).humanize().s,
        path: theFilePath,
        content: data,
        metadata: {},
      });
    });
  });
};

const parseFilesWithExtension = function (folderpath, ext, parser, limiter) {
  return new Promise(function (resolve, reject) {
    dir.files(folderpath, function (err, everyFile) {
      let files = everyFile.filter(function (item) {
        if (path.parse(item).ext === ext) {
          if (limiter) {
            if (limiter.indexOf(path.parse(item).name.replace(/^[\d-]*/, '')) > -1) {
              return true;
            } else {
              return false;
            }
          }

          return true;
        }

        return false;
      }).sort(function (a, b) {
        return a.localeCompare(b);
      });

      Promise
        .all(files.map(readFile))
        .then(function (allFiles) {
          let patterns = [];

          allFiles.forEach(function (item) {
            item.content = parser(item.content);
            item.localPath = getLocalPath(folderpath, item.path);
            patterns.push(item);
          });

          resolve(patterns);
        })
      ;
    });
  });
};

const getInfo = function (folderpath, limiter) {
  return new Promise(function (resolve, reject) {
    let patternInfo = JSON.parse(JSON.stringify(patternInfoDefaults));
    let theFolderPath = folderpath.slice(0);
    let name = getModuleNameFromPath(theFolderPath);

    patternInfo.name = formatName(name);
    patternInfo.namePretty = S(name).humanize().s;
    patternInfo.path = theFolderPath;

    Promise.all([
      parseFilesWithExtension(theFolderPath, '.html', htmlFileParser, limiter),
      parseFilesWithExtension(theFolderPath, '.md', markdownFileParser),
    ]).then(function (all) {
      patternInfo.html = all[0];
      patternInfo.md = all[1];

      resolve(patternInfo);
    });
  });
};

module.exports = getInfo;
