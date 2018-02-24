'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const {ipcRenderer, shell} = require('electron');
const chokidar = require('chokidar');
const browserSync = require('browser-sync').create();

const classify = require(`${__dirname}/../../../shared/classify`);
const fileFinder = require(`${__dirname}/../../lib/file-finder`);
const patternLibGenerator = require(`${__dirname}/../../lib/pattern-lib-generator`);
const watcherIgnore = require(`${__dirname}/../../lib/watcher-ignore`);

const env = process.env.NODE_ENV;
const DEBUG = !!(env === 'development');

let appPkg = require(`${__dirname}/../../../../package.json`);

const $body = document.body;
const $header = document.getElementById('header');
const $main = document.getElementById('main');
const $gears = document.querySelector('.gears');
const $check = document.querySelector('.check');
const $foldername = document.getElementById('folder-name');
const $btnBrowse = document.getElementById('btn-browse');

let isGenerating = false;
let browseTimeout = false;
let currentFolderPath;
let watcher = false;
let serverPort = 3000;

const getHost = function () {
  return `https://localhost:${serverPort}`;
};

const resetInterface = function () {
  $header.removeAttribute('hidden');
  $main.setAttribute('hidden', true);
  $gears.removeAttribute('hidden');
  $check.setAttribute('hidden', true);
  $foldername.innerText = 'pattern-library';
  $btnBrowse.setAttribute('disabled', true);
  ipcRenderer.send('menu:disable-file-items');
};

const showFolderInterface = function () {
  $header.setAttribute('hidden', true);
  $main.removeAttribute('hidden');
  $gears.removeAttribute('hidden');
  $check.setAttribute('hidden', true);
  $foldername.innerText = path.parse(currentFolderPath).base;
  $btnBrowse.setAttribute('disabled', true);
  ipcRenderer.send('menu:enable-file-items');
};

const showFinishedLoading = function () {
  $gears.setAttribute('hidden', true);
  $check.removeAttribute('hidden');
  $btnBrowse.removeAttribute('disabled');
};

const generate = function (next) {
  if (isGenerating) return;

  isGenerating = true;
  showFolderInterface();

  fileFinder.find(currentFolderPath).then(function (patternLibFiles) {
    patternLibGenerator.generate(currentFolderPath, patternLibFiles).then(function () {
      showFinishedLoading();
      isGenerating = false;

      if (next) next();
    });
  });
};

const addFolder = function (folderpath, next) {
  currentFolderPath = folderpath;
  showFolderInterface();

  if (watcher) watcher.close();
  if (browserSync.active) browserSync.exit();

  watcher = chokidar.watch(folderpath, {
    ignored: watcherIgnore,
    ignoreInitial: true,
    cwd: folderpath,
  });

  watcher.on('all', (evt, watchpath) => {
    if (watchpath.length <= 0) return;
    if (evt === 'addDir' && ['patterns', 'common', 'untitled folder'].includes(watchpath.toLowerCase())) return;

    generate(() => {
      browserSync.reload();
    });
  });

  watcher.on('ready', () => {
    browserSync.init({
      server: {
        baseDir: folderpath,
        directory: true,
      },
      https: true,
      open: false,
      notify: false,
    }, (err, browserSyncApi) => {
      serverPort = browserSyncApi.options.get('port');
      next()
    });
  });
};

const browsePatternLibrary = function () {
  if (browseTimeout) return;

  browseTimeout = setTimeout(function () {
    clearTimeout(browseTimeout);
    browseTimeout = false;
  }, 500);

  shell.openExternal(`${getHost()}/${patternLibGenerator.getOutputFile()}`);
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

  addFolder(e.dataTransfer.files[0].path, generate);

  return false;
}, true);

window.addEventListener('will-navigate', function (e) {
  e.preventDefault();
});

$btnBrowse.addEventListener('click', function () {
  browsePatternLibrary();
});

ipcRenderer.on('app:add-folder', function (e, folder) {
  if (typeof folder !== 'string') folder = folder[0];

  addFolder(folder, generate);
});

ipcRenderer.on('app:generate', function (e) {
  generate();
});

ipcRenderer.on('app:browse-pattern-library', function (e) {
  browsePatternLibrary();
});
