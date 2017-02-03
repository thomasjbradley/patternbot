'use strict';

const stripJs = require('strip-js');
const beautifier = require('js-beautify').html;
const beautifierOptions = require(`${__dirname}/beautifier.json`);
const htmlEscape = require(`${__dirname}/html-escape`);

// Work around for Beautifier’s wrap max limit of 32786
// https://github.com/beautify-web/js-beautify/blob/master/js/lib/beautify-html.js#L118
if (beautifierOptions.wrap_line_length == 0) {
  beautifierOptions.wrap_line_length = Number.MAX_SAFE_INTEGER;
}

const stripHiddenCode = function (data) {
  return data.replace(/<!--\s*patternbot:hide-start\s*-->[\s\S]*?\<!--\s*patternbot:hide-end\s*-->/g, '');
};

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

const escapeTags = function (data) {
  return htmlEscape(data);
};

module.exports = function (data) {
  [stripHiddenCode, stripHtmlWrapper, stripScriptTags, beautifyHtml, escapeTags].forEach(function (processor) {
    data = processor(data);
  });

  return data;
};
