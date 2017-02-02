'use strict';

const fs = require('fs');
const css = require('css');
const S = require('string');
const hexRgb = require('hex-rgb');
const rgbHex = require('rgb-hex');

const colourToHex = function (color) {
  if (color.match(/^\#/)) return color;

  return rgbHex(color).substr(0, 6);
};

const colourToRgba = function (color) {
  let rgb;

  if (color.match(/^rgb/)) return color;

  rgb = hexRgb(color);

  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;
};

const parseColour = function (declaration) {
  return {
    name: declaration.property,
    namePretty: S(declaration.property.replace(/\-\-color\-/, '')).humanize().s,
    hex: colourToHex(declaration.value),
    rgba: colourToRgba(declaration.value),
  }
};

const extractColours = function (cssProps) {
  let colours = {
    primary: [],
    secondary: [],
    neutral: [],
    accent: [],
  };

  cssProps.forEach(function (dec) {
    if (dec.type !== 'declaration' || !dec.property.match(/\-\-color/)) return;

    if (dec.property.match(/\-\-color\-primary/)) return colours.primary.push(parseColour(dec));
    if (dec.property.match(/\-\-color\-secondary/)) return colours.secondary.push(parseColour(dec));
    if (dec.property.match(/\-\-color\-neutral/)) return colours.neutral.push(parseColour(dec));

    return colours.accent.push(parseColour(dec));
  });

  return colours;
};

const parseFont = function (declaration, comments) {
  return {
    name: declaration.property,
    namePretty: declaration.value.match(/[^\,\;]*/)[0].replace(/["']/g, ''),
    weights: (comments) ? comments.split(',').map(item => item.trim()) : false,
  };
};

const extractFonts = function (cssProps) {
  let fonts = {
    primary: {},
    secondary: {},
    accent: [],
  };

  cssProps.forEach(function (dec, i) {
    let comments = false;

    if (dec.type !== 'declaration' || !dec.property.match(/\-\-font/)) return;

    if (cssProps[i + 1] && cssProps[i + 1].type === 'comment') comments = cssProps[i + 1].comment;

    if (dec.property.match(/\-\-font\-primary/)) return fonts.primary = parseFont(dec, comments);
    if (dec.property.match(/\-\-font\-secondary/)) return fonts.secondary = parseFont(dec, comments);

    return fonts.accent.push(parseFont(dec));
  });

  return fonts;
};

const parse = function (filepath) {
  return new Promise(function (resolve, reject) {
    if (!filepath) resolve([]);

    fs.readFile(filepath, 'utf8', function (err, data) {
      const code = css.parse(data);
      let cssVarsObj = false;
      let cssVars = {
        colours: {},
        fonts: {},
      };

      if (!code || !code.stylesheet || !code.stylesheet.rules) resolve({});

      cssVarsObj = code.stylesheet.rules.filter(function (item) {
        return (item.selectors && item.selectors[0] && item.selectors[0] === ':root');
      });

      if (!cssVarsObj && !cssVarsObj[0] && !cssVarsObj[0].declarations) resolve({});

      cssVars.colours = extractColours(cssVarsObj[0].declarations);
      cssVars.fonts = extractFonts(cssVarsObj[0].declarations);

      resolve(cssVars);
    });
  });
};

module.exports = {
  parse: parse,
};
