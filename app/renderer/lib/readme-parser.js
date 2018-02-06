'use strict';

const fs = require('fs');

const fileExists = require(`${__dirname}/../../shared/file-exists`);
const markdownFileParser = require(`${__dirname}/markdown-file-parser`);

const README_FILENAME = 'README.md';

const defaultReadme = {
  attributes: {},
};

const normalizeSpelling = function (readme) {
  if (readme.attributes.colors) readme.attributes.colours = readme.attributes.colors;

  if (!readme.attributes.backgroundColour) readme.attributes.backgroundColour = '#fff';
  if (readme.attributes.backgroundColor) readme.attributes.backgroundColour = readme.attributes.backgroundColor;
  if (readme.attributes.backgroundcolor) readme.attributes.backgroundColour = readme.attributes.backgroundcolor;
  if (readme.attributes.backgroundcolour) readme.attributes.backgroundColour = readme.attributes.backgroundcolour;

  if (readme.attributes.accentColor) readme.attributes.accentColour = readme.attributes.accentColor;
  if (readme.attributes.accentcolor) readme.attributes.accentColour = readme.attributes.accentcolor;
  if (readme.attributes.accentcolour) readme.attributes.accentColour = readme.attributes.accentcolour;

  if (readme.attributes.fontURL) readme.attributes.fontUrl = readme.attributes.fontURL;
  if (readme.attributes.fonturl) readme.attributes.fontUrl = readme.attributes.fonturl;

  return readme
};

const parse = function (folderpath) {
  return new Promise((resolve, reject) => {
    const readmepath = `${folderpath}/${README_FILENAME}`;

    if (!fileExists.check(readmepath)) return resolve(defaultReadme);

    fs.readFile(readmepath, 'utf8', (err, data) => {
      let readme = markdownFileParser(data);

      readme = normalizeSpelling(readme);

      resolve(readme);
    });
  });
};

module.exports = {
  parse: parse,
};
