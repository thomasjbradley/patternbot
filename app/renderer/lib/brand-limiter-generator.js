'use strict';

module.exports = function (commonInfo) {
  let limiters = ['logos'];
  let totalFonts = 0;
  let totalColours = 0;

  if (commonInfo.theme && commonInfo.theme.colours) {
    Object.keys(commonInfo.theme.colours).forEach((key) => {
      totalColours += commonInfo.theme.colours[key].length;
    });
  }

  if (commonInfo.theme && commonInfo.fonts) {
    if (Object.keys(commonInfo.theme.fonts.primary).length > 0) totalFonts++;
    if (Object.keys(commonInfo.theme.fonts.secondary).length > 0) totalFonts++;
    totalFonts += commonInfo.theme.fonts.accent.length;
  }

  if (totalColours > 0) limiters.push('colours');
  if (totalFonts > 0 && commonInfo.readme.attributes.fontUrl) limiters.push('typefaces');

  return limiters;
};
