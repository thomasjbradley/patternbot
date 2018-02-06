'use strict';

const https = require('https');
const css = require('css');
const S = require('string');
const getDefaultFontWeights = require(`${__dirname}/css-font-defaults`);

let cachedFontUrls = {};

const env = process.env.NODE_ENV;
const DEBUG = !!(env === 'development');

const parseCssWeights = function (data) {
  let code;
  let weights = {};
  let cssFontObj;

  try {
    code = css.parse(data);
  } catch (e) {
    return resolve(weights);
  }

  if (!code || !code.stylesheet || !code.stylesheet.rules) return resolve(weights);

  cssFontObj = code.stylesheet.rules.filter((item) => {
    return (item.type === 'font-face');
  });

  if (!cssFontObj || !cssFontObj[0] || !cssFontObj[0].declarations) return resolve(weights);

  cssFontObj.forEach((fontFace) => {
    const fontFamily = fontFace.declarations.filter((dec) =>{
      return (dec.property === 'font-family');
    });

    const fontWeight = fontFace.declarations.filter((dec) =>{
      return (dec.property === 'font-weight');
    });

    const fontStyle = fontFace.declarations.filter((dec) =>{
      return (dec.property === 'font-style');
    });

    let normalizedFontWeight = fontWeight[0].value.replace(/[^\d]*/g, '');
    let fontId = S(fontFamily[0].value).slugify().s;

    if (!weights[fontId]) weights[fontId] = {};

    if (normalizedFontWeight == '400') normalizedFontWeight = 'normal';
    if (normalizedFontWeight == '700') normalizedFontWeight = 'bold';

    if (!weights[fontId][normalizedFontWeight]) {
      weights[fontId][normalizedFontWeight] = {
        weight: normalizedFontWeight,
        hasNormal: false,
        hasItalic: false,
      };
    }

    if (weights[fontId][normalizedFontWeight].hasNormal === false && fontStyle[0].value === 'normal') {
      weights[fontId][normalizedFontWeight].hasNormal = true;
    }

    if (weights[fontId][normalizedFontWeight].hasItalic === false && fontStyle[0].value === 'italic') {
      weights[fontId][normalizedFontWeight].hasItalic = true;
    }
  });

  return weights;
};

module.exports = function (fontUrl) {
  return new Promise((resolve, reject) => {
    if (!fontUrl) return resolve({});

    if (cachedFontUrls[fontUrl]) {
      if (DEBUG) console.log('Using cached font CSS file…');
      return resolve(cachedFontUrls[fontUrl]);
    } else {
      if (DEBUG) console.log('Downloading font CSS file…');
      https.get(fontUrl, (res) => {
        let rawData = '';

        if (res.statusCode !== 200) return resolve({});
        if (!/text\/css/i.test(res.headers['content-type'])) return resolve({});

        res.on('data', (d) => { rawData += d });

        res.on('end', () => {
          let data = rawData.toString('utf8');
          let weights = parseCssWeights(data);
          cachedFontUrls[fontUrl] = weights;
          return resolve(weights);
        });
      }).on('error', (e) => {
        if (DEBUG) console.log('Font CSS download error', e);
        resolve({});
      });
    }
  });
};
