'use strict';

const S = require('string');
const templateHelper = require(__dirname + '/template-helper');

const render = function (moduleInfo) {
  return templateHelper.render('pattern-single.html', {
    title: moduleInfo.namePretty,
    showSubHeadings: (Object.keys(moduleInfo.html).length > 1),
    patterns: moduleInfo.html,
  });
};

const renderAll = function (modules) {
  let renders = [];

  modules.forEach(function (mod) {
    renders.push(render(mod));
  });
console.log(renders);
  return renders;
};

module.exports = {
  renderAll: renderAll,
};
