'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const {ipcRenderer, shell} = require('electron');

const classify = require(__dirname + '/../../../shared/classify');
const fileFinder = require(__dirname + '/../../lib/file-finder');
const patternLibGenerator = require(__dirname + '/../../lib/pattern-lib-generator');

let appPkg = require(__dirname + '/../../../../package.json');

const $body = document.body;

const savePatternLib = function (folderpath, patternLibString) {
  fs.writeFile(folderpath + '/' + appPkg.config.patternLibFilename, patternLibString, function () {

  });
};

const addFolder = function (folderpath) {
  fileFinder.find(folderpath).then(function (patternLibFiles) {
    patternLibGenerator.generate(patternLibFiles).then(function (patternLibString) {
      savePatternLib(folderpath, patternLibString);
    });
  });
};

$body.classList.add(`os-${os.platform()}`);

$body.addEventListener('dragover', function (e) {
  e.stopImmediatePropagation();
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = 'copy';

  return false;
}, true);

$body.addEventListener('dragleave', function (e) {
  e.stopImmediatePropagation();
  e.stopPropagation();
  e.preventDefault();

  return false;
}, true);

$body.addEventListener('drop', function (e) {
  e.preventDefault();

  addFolder(e.dataTransfer.files[0].path);

  return false;
}, true);

window.addEventListener('will-navigate', function (e) {
  e.preventDefault();
});
