'use strict';

const https = require('https');
const css = require('css');
const S = require('string');
const getDefaultFontWeights = require(`${__dirname}/css-font-defaults`);

let cachedFontUrls = {};

const parseCssWeights = function (data) {
  const code = css.parse(data);
  let weights = {};
  let cssFontObj;

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

    if (cachedFontUrls[fontUrl]) {
      console.log('Using cached font CSS file…');
      return resolve(cachedFontUrls[fontUrl]);
    } else {
      console.log('Downloading font CSS file…');
      https.get(fontUrl, (res) => {
        let rawData = '';

        if (res.statusCode !== 200) return resolve(weights);
        if (!/text\/css/i.test(res.headers['content-type'])) return resolve(weights);

        res.on('data', (d) => { rawData += d });

        res.on('end', () => {
          let data = rawData.toString('utf8');
          let weights = parseCssWeights(data);
          cachedFontUrls[fontUrl] = weights;
          return resolve(weights);
        });
      }).on('error', (e) => {
        console.log('Font CSS download error', e);
        resolve(weights);
      });
    }
  });
};
