'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const {ipcRenderer, shell} = require('electron');

const classify = require(`${__dirname}/../../../shared/classify`);
const fileFinder = require(`${__dirname}/../../lib/file-finder`);
const patternLibGenerator = require(`${__dirname}/../../lib/pattern-lib-generator`);

let appPkg = require(`${__dirname}/../../../../package.json`);

const $body = document.body;
const $header = document.getElementById('header');
const $main = document.getElementById('main');
const $gears = document.querySelector('.gears');
const $foldername = document.getElementById('folder-name');
const $btnGenerate = document.getElementById('btn-generate');

let currentFolderPath;

const resetInterface = function () {
  $header.removeAttribute('hidden');
  $main.setAttribute('hidden', true);
  $gears.removeAttribute('hidden');
  $foldername.innerText = 'pattern-library';
  $btnGenerate.setAttribute('disabled', true);
  ipcRenderer.send('menu:disable-file-items');
};

const showFolderInterface = function () {
  $header.setAttribute('hidden', true);
  $main.removeAttribute('hidden');
  $gears.removeAttribute('hidden');
  $foldername.innerText = path.parse(currentFolderPath).base;
  $btnGenerate.setAttribute('disabled', true);
  ipcRenderer.send('menu:enable-file-items');
};

const showFinishedLoading = function () {
  $gears.setAttribute('hidden', true);
  $btnGenerate.removeAttribute('disabled');
};

const generate = function () {
  showFolderInterface();

  fileFinder.find(currentFolderPath).then(function (patternLibFiles) {
    patternLibGenerator.generate(currentFolderPath, patternLibFiles).then(function () {
      showFinishedLoading();
    });
  });
};

const addFolder = function (folderpath) {
  currentFolderPath = folderpath;
  showFolderInterface();
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
  generate();

  return false;
}, true);

window.addEventListener('will-navigate', function (e) {
  e.preventDefault();
});

ipcRenderer.on('app:add-folder', function (e, folder) {
  if (typeof folder !== 'string') folder = folder[0];

  addFolder(folder);
  generate();
});

ipcRenderer.on('app:generate', function (e) {
  generate();
});
