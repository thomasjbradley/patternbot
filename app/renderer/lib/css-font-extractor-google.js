'use strict';

const S = require('string');

const getDefaultFontWeights = require(`${__dirname}/css-font-defaults`);

module.exports =  function (fontUrl) {
  return new Promise((resolve, reject) => {
    let fontUrlWeights;
    let weightBits = [];
    let weights = {};

    if (!fontUrl) resolve(weights);

    fontUrlWeights = fontUrl.split(/=/)[1];

    if (!fontUrlWeights) resolve(weights);

    weightBits = fontUrlWeights.split('|');

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
        weightsAndStyles = getDefaultFontWeights();
      }

      weights[S(nameWeights[0].replace(/\+/g, ' ')).slugify().s] = weightsAndStyles;
    });

    resolve(weights);
  });
};
