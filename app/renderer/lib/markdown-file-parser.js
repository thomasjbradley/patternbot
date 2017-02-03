'use strict';

const marked = require('marked');
const frontMatter = require('front-matter');

module.exports = function (data) {
  let readme = frontMatter(data);

  readme.body = marked(readme.body);

  return readme;
};
