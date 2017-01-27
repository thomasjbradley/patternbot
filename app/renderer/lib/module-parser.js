'use strict';

const fs = require('fs');
const path = require('path');
const dir = require('node-dir');

const htmlFileParser = require(__dirname + '/html-file-parser');
const markdownFileParser = require(__dirname + '/markdown-file-parser');

const moduleInfoDefaults = {
  name: false,
  path: '',
  html: {},
  md: {},
};

const getModuleNameFromPath = function (folderpath) {
  return path.parse(folderpath).name;
};

const readFile = function (filepath) {
  return new Promise(function (resolve, reject) {
    fs.readFile(filepath, 'utf8', function (err, data) {
      resolve({
        name: path.parse(filepath).name,
        path: filepath,
        content: data,
        metadata: {},
      });
    });
  });
};

const parseFilesWithExtension = function (folderpath, moduleInfo, ext, parser) {
  return new Promise(function (resolve, reject) {
    dir.files(folderpath, function (err, allFiles) {
      let htmlFiles = allFiles.filter(function (item) {
        return (path.parse(item).ext === ext);
      });

      Promise
        .all(htmlFiles.map(readFile))
        .then(function (allHtmlFiles) {
          allHtmlFiles.forEach(function (item) {
            item.content = parser(item.content);
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

  moduleInfo.name = getModuleNameFromPath(folderpath);
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
