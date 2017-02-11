'use strict';

const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const marked = require('marked');

const TEMPLATE_FOLDER = path.resolve(`${__dirname}/../templates`);

let templates = {};

const get = function (id) {
  if (!templates[id]) templates[id] = fs.readFileSync(`${TEMPLATE_FOLDER}/${id}`, 'utf8');

  return templates[id];
};

const renderString = function (str, obj, handlebarsOpts) {
  return handlebars.compile(str, handlebarsOpts)(obj);
};

const render = function (id, obj, handlebarsOpts) {
  return renderString(get(id), obj, handlebarsOpts);
};

handlebars.registerHelper('markdown', marked);

handlebars.registerHelper('times', function (n, block) {
  let accum = '';

  for(let i = 1; i <= n; ++i) {
    block.data.index = i;
    block.data.first = i === 1;
    block.data.last = i === (n);
    accum += block.fn(this);
  }

  return accum;
});

handlebars.registerHelper('loop', function (n, block) {
  let accum = '';

  for (let i = 1; i <= n; ++i) {
    accum += block.fn(i);
  }

  return accum;
});

handlebars.registerPartial('typekit', get('typekit.js'));

module.exports = {
  TEMPLATE_FOLDER: TEMPLATE_FOLDER,
  get: get,
  renderString: renderString,
  render: render,
};
