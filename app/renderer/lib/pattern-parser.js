'use strict';

const fs = require('fs');
const path = require('path');
const merge = require('merge-objects');
const S = require('string');
const fontColorContrast = require('font-color-contrast');
const readmeParser = require(`${__dirname}/readme-parser`);
const readmePropertyVariants = require(`${__dirname}/readme-property-variants`);
const cssColorNames = require(`${__dirname}/css-colour-names`);
const classify = require(`${__dirname}/../../shared/classify`);
const htmlFileParser = require(`${__dirname}/html-file-parser`);
const markdownFileParser = require(`${__dirname}/markdown-file-parser`);
const hexFullLength = require(`${__dirname}/hex-full-length`);

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

const constructFile = function (folderpath, filepath, options = {}) {
  return new Promise(function (resolve, reject) {
    let theFilePath = `${folderpath}/${filepath}`;
    let name = formatName(path.parse(theFilePath).name);

    resolve({
      name: name,
      namePretty: S(name).humanize().s,
      filename: path.parse(theFilePath).name,
      path: theFilePath,
      localPath: getLocalPath(folderpath, theFilePath),
    });
  });
};

const readFile = function (fileObj, options = {}) {
  return new Promise(function (resolve, reject) {
    fs.readFile(fileObj.path, 'utf8', (err, data) => {
      if (options.readmeReplace) {
        options.readmeReplace.forEach((item) => {
          if (!item.search || !item.replace) return;
          data = data.replace(item.search, item.replace);
        });
      }

      fileObj.content = data;
      resolve(fileObj);
    });
  });
};

const findFilesWithExtension = function (folderpath, ext, limiter = null, options = {}) {
  return new Promise((resolve, reject) => {
    fs.readdir(folderpath, (err, everyFile) => {
      let files = filterAndSortFiles(everyFile, ext, limiter);

      Promise.all(files.map((file) => constructFile(folderpath, file, options))).then((allFiles) => {
        resolve(allFiles);
      });
    });
  });
};

const parseFilesWithExtension = function (folderpath, ext, parser, limiter = null, options = {}) {
  return new Promise((resolve, reject) => {
    findFilesWithExtension(folderpath, ext, limiter, options).then((everyFile) => {
      Promise.all(everyFile.map((fileObj) => readFile(fileObj, options))).then((allFiles) => {
        let patterns = [];

        allFiles.forEach((item) => {
          item.content = parser.parse(item.content);
          patterns.push(item);
        });

        resolve(patterns);
      });
    });
  });
};

const normalizeProperties = function (readme, commonInfo) {
  Object.keys(readmePropertyVariants).forEach((prop) => {
    readmePropertyVariants[prop].forEach((propVariant) => {
      if (readme[propVariant]) readme[prop] = readme[propVariant];
    });
  });

  if (readme.width) readme.width = parseInt(readme.width, 10);
  if (readme.height) readme.height = parseInt(readme.height, 10);
  if (readme.padding && typeof readme.padding === 'number') readme.padding = `${readme.padding}px`;

  if (commonInfo && commonInfo.theme && commonInfo.theme.coloursRaw) readme = readmeParser.convertVarColours(readme, commonInfo.theme.coloursRaw);

  return readme;
};

const setUpReadme = function (patternHtml, patternMd, html, readme, options = {}) {
  let finalReadme = {};

  if (!(patternMd && patternMd.content && patternMd.content.attributes && patternMd.content.attributes[html.name])) return;

  if (readme && readme[html.name]) finalReadme = readme[html.name];

  if (typeof patternMd.content.attributes[html.name] === 'string') {
    finalReadme.desc = patternMd.content.attributes[html.name];
  } else {
    finalReadme = merge(finalReadme, patternMd.content.attributes[html.name]);
  }

  finalReadme = normalizeProperties(finalReadme, (options.commonInfo) ? options.commonInfo : null);

  if (finalReadme.backgroundColour) {
    if (cssColorNames[finalReadme.backgroundColour]) finalReadme.backgroundColour = cssColorNames[finalReadme.backgroundColour];

    if (fontColorContrast(hexFullLength(finalReadme.backgroundColour)) === '#000000') {
      finalReadme.interfaceColours = {
        primary: 0,
        opposite: 255,
      };
    } else {
      finalReadme.interfaceColours = {
        primary: 255,
        opposite: 0,
      };
    }
  }

  return finalReadme;
};

const getInfo = function (folderpath, limiter, readme, options = {}) {
  return new Promise(function (resolve, reject) {
    let patternInfo = JSON.parse(JSON.stringify(patternInfoDefaults));
    let theFolderPath = folderpath.slice(0);
    let name = getModuleNameFromPath(theFolderPath);

    patternInfo.name = formatName(name);
    patternInfo.namePretty = S(name).humanize().s;
    patternInfo.path = theFolderPath;

    Promise.all([
      parseFilesWithExtension(theFolderPath, '.md', markdownFileParser, null, options),
      parseFilesWithExtension(theFolderPath, '.html', htmlFileParser, limiter, options),
      findFilesWithExtension(theFolderPath, '.css', limiter, options),
    ]).then(function (all) {
      patternInfo.md = all[0];
      patternInfo.html = all[1];
      patternInfo.css = all[2];

      patternInfo.html.forEach((html, i) => {
        patternInfo.html[i].readme = setUpReadme(patternInfo.html[i], (patternInfo.md[0]) ? patternInfo.md[0] : null, html, readme, options);
      });

      resolve(patternInfo);
    });
  });
};

module.exports = getInfo;
