'use strict';

const extractFrom = function (css, matcher) {
  let matcherRegex = (typeof matcher !== 'undefined') ? matcher : 'modulifier|gridifier|typografier';
  let regex = new RegExp(`https://(${matcherRegex})\.web-dev\.tools/#([^\\s]+)`);
  let commentMatches = css.match(regex);

  if (!commentMatches || !commentMatches[2]) return false;

  return commentMatches[2];
};

module.exports = {
  extractFrom: extractFrom,
};
