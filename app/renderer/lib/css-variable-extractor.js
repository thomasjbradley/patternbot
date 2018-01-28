'use strict';

const fs = require('fs');
const css = require('css');
const S = require('string');
const hexRgb = require('hex-rgb');
const rgbHex = require('rgb-hex');
const extractGoogleFontWeights = require(`${__dirname}/css-font-extractor-google`);
const extractTypekitFontWeights = require(`${__dirname}/css-font-extractor-typekit`);
const getDefaultFontWeights = require(`${__dirname}/css-font-defaults`);

const cssColorNames = require(`${__dirname}/css-colour-names.json`);

const colourToHex = function (color) {
  if (/^\#/.test(color)) return color;
  if (cssColorNames[color]) return cssColorNames[color];
  if (!/^rgb/.test(color)) return false;

  return rgbHex(color).substr(0, 6);
};

const colourToRgba = function (color) {
  let rgb;

  if (/^rgb/.test(color)) return color;

  if (cssColorNames[color]) {
    rgb = hexRgb(cssColorNames[color]);
    return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, 1)`;
  }

  if (/^\#/.test(color)) {
    rgb = hexRgb(color);
    return `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, 1)`;
  }

  return false;
};

const parseColour = function (declaration) {
  return {
    name: declaration.property,
    namePretty: S(declaration.property.replace(/\-\-color\-/, '')).humanize().s,
    raw: declaration.value,
    hex: colourToHex(declaration.value),
    rgba: colourToRgba(declaration.value),
  }
};

const extractColours = function (cssProps) {
  return new Promise((resolve, reject) => {
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

    resolve(colours);
  });
};

const extractFontWeights = function (fontUrl) {
  if (/google/i.test(fontUrl)) return extractGoogleFontWeights(fontUrl);
  if (/typekit/i.test(fontUrl)) return extractTypekitFontWeights(fontUrl);
};

const parseFont = function (declaration, weightsAndStyles, comments) {
  let namePretty = S(declaration.value.match(/[^\,\;]*/)[0].replace(/["']/g, '')).humanize().titleCase().s;
  let fontId = S(declaration.value.match(/[^\,\;]*/)[0].replace(/["']/g, '')).slugify().s;

  return {
    name: declaration.property,
    namePretty: namePretty,
    raw: declaration.value,
    weights: (weightsAndStyles[fontId]) ? weightsAndStyles[fontId] : getDefaultFontWeights(),
  };
};

const extractFonts = function (cssProps, fontUrl) {
  return new Promise((resolve, reject) => {
    let fonts = {
      primary: {},
      secondary: {},
      accent: [],
    };

    extractFontWeights(fontUrl).then((availableWeights) => {
      cssProps.forEach(function (dec, i) {
        let comments = false;

        if (dec.type !== 'declaration' || !dec.property.match(/\-\-font/)) return;

        if (cssProps[i + 1] && cssProps[i + 1].type === 'comment') comments = cssProps[i + 1].comment;

        if (dec.property.match(/\-\-font\-primary/)) return fonts.primary = parseFont(dec, availableWeights, comments);
        if (dec.property.match(/\-\-font\-secondary/)) return fonts.secondary = parseFont(dec, availableWeights, comments);

        return fonts.accent.push(parseFont(dec, availableWeights));
      });

      resolve(fonts);
    }).catch((e) => {
      console.log('Font weight extraction error', e);
      resolve(fonts);
    });
  });
};

const parse = function (filepath, readme) {
  return new Promise(function (resolve, reject) {
    if (!filepath) return resolve([]);

    fs.readFile(filepath, 'utf8', function (err, data) {
      const code = css.parse(data);
      let cssVarsObj = false;
      let cssVars = {
        colours: {},
        fonts: {},
      };

      if (!code || !code.stylesheet || !code.stylesheet.rules) return resolve({});

      cssVarsObj = code.stylesheet.rules.filter(function (item) {
        return (item.selectors && item.selectors[0] && item.selectors[0] === ':root');
      });

      if (!cssVarsObj || !cssVarsObj[0] || !cssVarsObj[0].declarations) return resolve({});

      Promise.all([
        extractColours(cssVarsObj[0].declarations),
        extractFonts(cssVarsObj[0].declarations, (readme.attributes.fontUrl) ? readme.attributes.fontUrl : false),
      ]).then((extractionResults) => {
        cssVars.colours = extractionResults[0];
        cssVars.fonts = extractionResults[1];
        resolve(cssVars);
      }).catch((e) => {
        console.log('CSS variable extraction error', e);
        resolve(cssVars);
      });
    });
  });
};

module.exports = {
  parse: parse,
};
