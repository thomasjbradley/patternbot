'use strict';

const {app, dialog} = require('electron');
const is = require('electron-is');

const addFolderOpts = {
  title: 'Add Folder…',
  properties: ['openDirectory'],
};

const commands = {
  'app:quit': function (menuItem, win) {
    app.quit();
  },

  'app:add-folder': function (menuItem, win) {
    if (is.macOS()) addFolderOpts.properties.push('openFile');

    dialog.showOpenDialog(win, addFolderOpts, function (folderpath) {
      if (folderpath) win.send('app:add-folder', folderpath);
    });
  },

  'app:generate': function (menuItem, win) {
    win.send('app:generate');
  },

  'app:browse-pattern-library': function (menuItem, win) {
    win.send('app:browse-pattern-library');
  },
};

module.exports = require(__dirname + '/../menu-helper')(commands);
