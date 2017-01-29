'use strict';

const extractFrom = function (css) {
  let commentMatches = css.match(/https\:\/\/(modulifier|gridifier|typografier)\.web\-dev\.tools\/\#([^\s]+)/);

  if (!commentMatches || !commentMatches[2]) return false;

  return commentMatches[2];
};

module.exports = {
  extractFrom: extractFrom,
};
