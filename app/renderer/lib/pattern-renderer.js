'use strict';

const S = require('string');
const templateHelper = require(__dirname + '/template-helper');

const render = function (patternInfo) {
  const renderedTemplate = templateHelper.render('pattern-single.html', {
    name: patternInfo.name,
    namePretty: patternInfo.namePretty,
    showSubHeadings: (Object.keys(patternInfo.html).length > 1),
    patterns: patternInfo.html,
  });

  return {
    name: patternInfo.name,
    namePretty: patternInfo.namePretty,
    content: renderedTemplate,
  };
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
