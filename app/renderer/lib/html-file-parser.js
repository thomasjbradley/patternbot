'use strict';

const stripJs = require('strip-js');
const beautifier = require('js-beautify').html;
const beautifierOptions = require(__dirname + '/beautifier.json');

// Work around for Beautifier’s wrap max limit of 32786
// https://github.com/beautify-web/js-beautify/blob/master/js/lib/beautify-html.js#L118
if (beautifierOptions.wrap_line_length == 0) {
  beautifierOptions.wrap_line_length = Number.MAX_SAFE_INTEGER;
}

const stripHtmlWrapper = function (data) {
  let htmlBits = data.split(/\<body[^>]*\>/);

  if (!htmlBits[1]) return data;

  return htmlBits[1].replace(/\<\/(body|html)\>/g, '').trim();
};

const stripScriptTags = function (data) {
  return stripJs(data);
};

const beautifyHtml = function (data) {
  return beautifier(data, beautifierOptions);
};

module.exports = function (data) {
  [stripHtmlWrapper, stripScriptTags, beautifyHtml].forEach(function (processor) {
    data = processor(data);
  });

  return data;
};
