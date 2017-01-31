'use strict';

const S = require('string');
const merge = require('merge-objects');
const templateHelper = require(`${__dirname}/template-helper`);

const render = function (patternInfo, opts) {
  const obj = merge(JSON.parse(JSON.stringify(opts)), {
    name: patternInfo.name,
    namePretty: patternInfo.namePretty,
    showSubHeadings: (Object.keys(patternInfo.html).length > 1),
    patterns: patternInfo.html,
  });
  const renderedTemplate = templateHelper.render('pattern-single.html', obj);

  return {
    name: patternInfo.name,
    namePretty: patternInfo.namePretty,
    content: renderedTemplate,
    opts: opts,
  };
};

const renderAll = function (patterns, opts) {
  let renders = [];

  if (typeof opts === 'undefined') opts = {};

  patterns.forEach(function (mod) {
    renders.push(render(mod, opts));
  });

  return renders;
};

module.exports = {
  renderAll: renderAll,
};
