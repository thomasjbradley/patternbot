'use strict';

const fs = require('fs');
const css = require('css');

const parse = function (filepath) {
  return new Promise(function (resolve, reject) {
    if (!filepath) resolve([]);

    fs.readFile(filepath, 'utf8', function (err, data) {
      const code = css.parse(data);
      let cssVarsObj = false;
      let cssVars = {};

      if (!code || !code.stylesheet || !code.stylesheet.rules) resolve({});

      cssVarsObj = code.stylesheet.rules.filter(function (item) {
        return (item.selectors && item.selectors[0] && item.selectors[0] === ':root');
      });

      if (!cssVarsObj && !cssVarsObj[0] && !cssVarsObj[0].declarations) resolve({});

      cssVarsObj[0].declarations.forEach(function (dec) {
        cssVars[dec.property] = dec.value;
      });

      resolve(cssVars);
    });
  });
};

module.exports = {
  parse: parse,
};
