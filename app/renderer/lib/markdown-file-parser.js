'use strict';

const marked = require('marked');
const frontMatter = require('front-matter');

module.exports = function (data) {
  let readme = {
    attributes: {},
    body: '',
  };

  try {
    readme = frontMatter(data);
  } catch (e) {
    return readme;
  }

  try {
    readme.body = marked(readme.body);
  } catch (e) {
    return readme;
  }

  return readme;
};
