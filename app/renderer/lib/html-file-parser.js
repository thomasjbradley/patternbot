'use strict';

const stripJs = require('strip-js');

const stripHtmlWrapper = function (data) {
  let htmlBits = data.split(/\<body[^>]*\>/);

  if (!htmlBits[1]) return data;

  return htmlBits[1].replace(/\<\/(body|html)\>/g, '').trim();
};

const stripScriptTags = function (data) {
  return stripJs(data);
};

module.exports = function (data) {
  [stripHtmlWrapper, stripScriptTags].forEach(function (processor) {
    data = processor(data);
  });

  return data;
};
