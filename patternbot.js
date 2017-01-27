'use strict';

const {app, ipcMain, BrowserWindow, dialog, Menu} = require('electron');
const is = require('electron-is');

const env = process.env.NODE_ENV;
const appPkg = require(__dirname + '/package.json');

let mainWindow;

const createMainWindow = function (next) {
  mainWindow = new BrowserWindow({
    width: 700,
    minWidth: 600,
    height: 400,
    show: false,
    minHeight: 400,
    vibrancy: 'light',
  });

  mainWindow.loadURL('file://' + __dirname + '/app/renderer/windows/main/main.html');

  if (env === 'development') mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;

    if (!is.macOS()) app.quit();
  });

  mainWindow.on('focus', function () {
    mainWindow.webContents.send('app:focus');
  });

  mainWindow.on('blur', function () {
    mainWindow.webContents.send('app:blur');
  });

  mainWindow.once('ready-to-show', function () {
    mainWindow.show();

    if (next) next();
  });
};

app.on('ready', function () {
  createMainWindow();
});

app.on('window-all-closed', function () {
  if (!is.macOS()) app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createMainWindow();
});

app.on('open-file', function (e, filepath) {
  e.preventDefault();

  if (typeof filepath !== 'string') filepath = filepath[0];

  if (mainWindow === null) {
    createMainWindow(function () {
      mainWindow.webContents.send('app:add-files', filepath);
    });
  } else {
    mainWindow.webContents.send('app:add-files', filepath);
  }
});
