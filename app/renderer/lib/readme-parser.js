'use strict';

const fs = require('fs');

const fileExists = require(`${__dirname}/../../shared/file-exists`);
const markdownFileParser = require(`${__dirname}/markdown-file-parser`);
const readmePropertyVariants = require(`${__dirname}/readme-property-variants`);

const README_FILENAME = 'README.md';

const normalizeProperties = function (readme) {
  if (Object.keys(readme.attributes).length <= 0) return readme;

  Object.keys(readmePropertyVariants).forEach((prop) => {
    readmePropertyVariants[prop].forEach((propVariant) => {
      if (readme.attributes[propVariant]) readme.attributes[prop] = readme.attributes[propVariant];
    });
  });

  if (!readme.attributes.backgroundColour) readme.attributes.backgroundColour = '#fff';

  return readme
};

const parse = function (folderpath) {
  return new Promise((resolve, reject) => {
    const readmepath = `${folderpath}/${README_FILENAME}`;

    if (!fileExists.check(readmepath)) return resolve(markdownFileParser.default());

    fs.readFile(readmepath, 'utf8', (err, data) => {
      let readme = markdownFileParser.parse(data);

      readme = normalizeProperties(readme);

      resolve(readme);
    });
  });
};

module.exports = {
  parse: parse,
};
