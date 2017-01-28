'use strict';

const fs = require('fs');
const path = require('path');
const dir = require('node-dir');
const S = require('string');
const htmlFileParser = require(__dirname + '/html-file-parser');
const markdownFileParser = require(__dirname + '/markdown-file-parser');

const moduleInfoDefaults = {
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
        name: name,
        namePretty: S(name).humanize().s,
        path: filepath,
        content: data,
        metadata: {},
      });
    });
  });
};

const parseFilesWithExtension = function (folderpath, moduleInfo, ext, parser) {
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
            moduleInfo[ext.replace(/\./g, '')][item.name] = item;
          });

          resolve(moduleInfo);
        })
      ;
    });
  });
};

const getInfo = function (folderpath) {
  let moduleInfo = JSON.parse(JSON.stringify(moduleInfoDefaults));
  let name = getModuleNameFromPath(folderpath);

  moduleInfo.name = name;
  moduleInfo.namePretty = S(name).humanize().s;
  moduleInfo.path = folderpath;

  return new Promise(function (resolve, reject) {
    Promise.all([
      parseFilesWithExtension(folderpath, moduleInfo, '.html', htmlFileParser),
      parseFilesWithExtension(folderpath, moduleInfo, '.md', markdownFileParser),
    ]).then(function () {
      resolve(moduleInfo);
    });
  });
};

module.exports = getInfo;
