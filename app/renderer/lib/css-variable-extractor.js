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
    raw: declaration.value,
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

const extractFontWeights = function (fontUrlWeights) {
  let weightBits = fontUrlWeights.split('|');
  let weights = {};

  weightBits.forEach((bit) => {
    let nameWeights = bit.split(':');
    let weightsAndStyles = {};

    if (nameWeights[1]) {
      let theWeights = nameWeights[1].split(',');

      theWeights.forEach((weight) => {
        let onlyNumber = weight.replace(/[^\d]*/g, '');

        if (onlyNumber == '400') onlyNumber = 'normal';
        if (onlyNumber == '700') onlyNumber = 'bold';

        if (!weightsAndStyles[onlyNumber]) {
          weightsAndStyles[onlyNumber] = {
            weight: onlyNumber,
            hasNormal: false,
            hasItalic: false,
          };
        }

        if (/^\d*$/.test(weight)) {
          weightsAndStyles[onlyNumber].hasNormal = true;
        } else {
          weightsAndStyles[onlyNumber].hasItalic = true;
        }
      });
    } else {
      weightsAndStyles = {
        normal: {
          weight: 'normal',
          hasNormal: false,
          hasItalic: false,
        },
      };
    }

    weights[nameWeights[0].replace(/\+/g, ' ')] = weightsAndStyles;
  });

  return weights;
};

const parseFont = function (declaration, weightsAndStyles, comments) {
  let namePretty = declaration.value.match(/[^\,\;]*/)[0].replace(/["']/g, '');

  return {
    name: declaration.property,
    namePretty: namePretty,
    raw: declaration.value,
    // weights: (comments) ? comments.split(',').map(item => item.trim()) : false,
    weights: (weightsAndStyles[namePretty]) ? weightsAndStyles[namePretty] : false,
  };
};

const extractFonts = function (cssProps, fontUrlWeights) {
  let fonts = {
    primary: {},
    secondary: {},
    accent: [],
  };
  let availableWeights = extractFontWeights(fontUrlWeights);

  cssProps.forEach(function (dec, i) {
    let comments = false;

    if (dec.type !== 'declaration' || !dec.property.match(/\-\-font/)) return;

    if (cssProps[i + 1] && cssProps[i + 1].type === 'comment') comments = cssProps[i + 1].comment;

    if (dec.property.match(/\-\-font\-primary/)) return fonts.primary = parseFont(dec, availableWeights, comments);
    if (dec.property.match(/\-\-font\-secondary/)) return fonts.secondary = parseFont(dec, availableWeights, comments);

    return fonts.accent.push(parseFont(dec, availableWeights));
  });

  return fonts;
};

const parse = function (filepath, readme) {
  let fontUrlWeights = (readme && readme.attributes.fontUrl && /=/.test(readme.attributes.fontUrl)) ? readme.attributes.fontUrl.split(/=/)[1] : false;

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
      cssVars.fonts = extractFonts(cssVarsObj[0].declarations, fontUrlWeights);

      resolve(cssVars);
    });
  });
};

module.exports = {
  parse: parse,
};
