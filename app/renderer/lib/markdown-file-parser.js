'use strict';

const marked = require('marked');
const frontMatter = require('front-matter');

const getDefault = function (readme) {
  if (!readme) {
    readme = {
      attributes: {},
      body: '',
    };
  }

  if (!readme.attributes) readme.attributes = {};
  if (!readme.body) readme.body = '';

  if (typeof readme.attributes !== 'object') readme.attributes = {};

  return readme;
};

const parse = function (data) {
  let readme = {
    attributes: {},
    body: '',
  };

  try {
    readme = frontMatter(data);
  } catch (e) {
    return getDefault(readme);
  }

  try {
    readme.bodyRaw = readme.body;
    readme.bodyBasic = readme.body.trim().replace(/[\n\r]/g, ' ').replace(/\s+/g, ' ');
    readme.body = marked(readme.body);
  } catch (e) {
    return getDefault(readme);
  }

  return getDefault(readme);
};

module.exports = {
  parse: parse,
  default: getDefault,
};
