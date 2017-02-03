'use strict';

const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const marked = require('marked');

const TEMPLATE_FOLDER = path.resolve(`${__dirname}/../templates`);

let templates = {};

handlebars.registerHelper('markdown', marked);

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

module.exports = {
  TEMPLATE_FOLDER: TEMPLATE_FOLDER,
  get: get,
  renderString: renderString,
  render: render,
};
