'use strict';

const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');

const TEMPLATE_FOLDER = path.resolve(__dirname + '/../templates');

let templates = {};

const get = function (id) {
  if (!templates[id]) templates[id] = fs.readFileSync(`${TEMPLATE_FOLDER}/${id}`, 'utf8');

  return templates[id];
};

const render = function (id, obj, handlebarsOpts) {
  return handlebars.compile(get(id), handlebarsOpts)(obj);
};

module.exports = {
  TEMPLATE_FOLDER: TEMPLATE_FOLDER,
  get: get,
  render: render,
};
