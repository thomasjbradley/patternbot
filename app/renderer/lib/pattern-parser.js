'use strict';

const fs = require('fs');
const path = require('path');
const dir = require('node-dir');
const S = require('string');
const classify = require(__dirname + '/../../shared/classify');
const htmlFileParser = require(__dirname + '/html-file-parser');
const markdownFileParser = require(__dirname + '/markdown-file-parser');

const patternInfoDefaults = {
  name: '',
  namePretty: '',
  path: '',
  html: {},
  md: {},
};

const getModuleNameFromPath = function (folderpath) {
  return path.parse(folderpath).name;
};

const getLocalPath = function (folderpath, filepath) {
  return folderpath.split(/[\/\\]/).slice(-2).join('/') + '/' + path.parse(filepath).base;
};

const readFile = function (filepath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filepath, 'utf8', function (err, data) {
      let name = path.parse(filepath).name;

      resolve({
        name: classify(name),
        namePretty: S(name).humanize().s,
        path: filepath,
        content: data,
        metadata: {},
      });
    });
  });
};

const parseFilesWithExtension = function (folderpath, patternInfo, ext, parser) {
  return new Promise(function (resolve, reject) {
    dir.files(folderpath, function (err, everyFile) {
      let files = everyFile.filter(function (item) {
        return (path.parse(item).ext === ext);
      });

      Promise
        .all(files.map(readFile))
        .then(function (allFiles) {
          allFiles.forEach(function (item) {
            item.content = parser(item.content);
            item.localPath = getLocalPath(folderpath, item.path);
            patternInfo[ext.replace(/\./g, '')][item.name] = item;
          });

          resolve(patternInfo);
        })
      ;
    });
  });
};

const getInfo = function (folderpath) {
  let patternInfo = JSON.parse(JSON.stringify(patternInfoDefaults));
  let name = getModuleNameFromPath(folderpath);

  patternInfo.name = classify(name);
  patternInfo.namePretty = S(name).humanize().s;
  patternInfo.path = folderpath;

  return new Promise(function (resolve, reject) {
    Promise.all([
      parseFilesWithExtension(folderpath, patternInfo, '.html', htmlFileParser),
      parseFilesWithExtension(folderpath, patternInfo, '.md', markdownFileParser),
    ]).then(function () {
      resolve(patternInfo);
    });
  });
};

module.exports = getInfo;
