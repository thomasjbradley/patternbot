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

const filterAndSortFiles = function (everyFile, ext, limiter) {
  return everyFile.filter(function (item) {
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
      });
    });
  });
};

const parseFilesWithExtension = function (folderpath, ext, parser, limiter) {
  return new Promise(function (resolve, reject) {
    dir.files(folderpath, function (err, everyFile) {
      let files = filterAndSortFiles(everyFile, ext, limiter);

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
      parseFilesWithExtension(theFolderPath, '.md', markdownFileParser),
      parseFilesWithExtension(theFolderPath, '.html', htmlFileParser, limiter),
    ]).then(function (all) {
      patternInfo.md = all[0];
      patternInfo.html = all[1];

      patternInfo.html.forEach((html, i) => {
        if (!(patternInfo.md && patternInfo.md[0] && patternInfo.md[0].content && patternInfo.md[0].content.attributes && patternInfo.md[0].content.attributes[html.name])) return;

        if (typeof patternInfo.md[0].content.attributes[html.name] === 'string') {
          patternInfo.html[i].readme = {
            desc: patternInfo.md[0].content.attributes[html.name],
          }
        } else {
          patternInfo.html[i].readme = patternInfo.md[0].content.attributes[html.name];
        }
      });

      resolve(patternInfo);
    });
  });
};

module.exports = getInfo;
