'use strict';

const fs = require('fs');

const fileExists = require(`${__dirname}/../../shared/file-exists`);
const markdownFileParser = require(`${__dirname}/markdown-file-parser`);

const README_FILENAME = 'README.md';

const parse = function (folderpath) {
  return new Promise((resolve, reject) => {
    const readmepath = `${folderpath}/${README_FILENAME}`;

    if (!fileExists.check(readmepath)) return resolve(false);

    fs.readFile(readmepath, 'utf8', (err, data) => {
      resolve(markdownFileParser(data));
    });
  });
};

module.exports = {
  parse: parse,
};
