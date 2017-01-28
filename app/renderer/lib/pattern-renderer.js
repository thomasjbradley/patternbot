'use strict';

const S = require('string');
const templateHelper = require(__dirname + '/template-helper');

const render = function (patternInfo) {
  return templateHelper.render('pattern-single.html', {
    title: patternInfo.namePretty,
    showSubHeadings: (Object.keys(patternInfo.html).length > 1),
    patterns: patternInfo.html,
  });
};

const renderAll = function (patterns) {
  let renders = [];

  patterns.forEach(function (mod) {
    renders.push(render(mod));
  });

  return renders;
};

module.exports = {
  renderAll: renderAll,
};
