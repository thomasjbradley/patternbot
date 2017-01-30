'use strict';

// Replacement for the Handlebars default escape because I don’t want anything except <, > escaped

module.exports = function (str) {
  return str.replace(/\</g, '&lt;').replace(/\>/, '&gt;');
};
