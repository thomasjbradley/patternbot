'use strict';

const marked = require('marked');
const frontMatter = require('front-matter');

module.exports = function (data) {
  let readme = frontMatter(data);

  Object.keys(readme.attributes).forEach((key) => {
    readme.attributes[key] = marked(readme.attributes[key]);
  });

  readme.body = marked(readme.body);

  return readme;
};
