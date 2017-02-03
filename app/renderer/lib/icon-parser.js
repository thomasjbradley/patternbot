'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const parseSvgIcons = function (svgicons) {
  let iconIdMatches = svgicons.match(/<symbol[^>]*id\s*=\s*"([^"]+)"/g);

  if (!iconIdMatches) return false;

  return iconIdMatches.map(function (id) {
    return id.replace(/<symbol[^>]*id\s*=\s*"/g, '').replace(/"/g, '').trim();
  });
};

const parseAll = function (iconfile) {
  return new Promise(function (resolve, reject) {
    if (!iconfile) return resolve(false);

    fs.readFile(iconfile, 'utf8', function (err, data) {
      resolve(parseSvgIcons(data));
    });
  });
};

module.exports = {
  parseAll: parseAll,
};
