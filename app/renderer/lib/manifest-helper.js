'use strict';

const fs = require('fs');

let appPkg = require(`${__dirname}/../../../package.json`);

const generate = function (folderpath, commonInfo, patternLibFiles, userPatterns) {
  let manifest = {};

  return new Promise((resolve, reject) => {
    manifest.commonInfo = JSON.parse(JSON.stringify(commonInfo));
    delete manifest.commonInfo.assets;
    delete manifest.commonInfo.readme.attributes.fonts;
    delete manifest.commonInfo.readme.attributes.colours;
    delete manifest.commonInfo.readme.attributes.colors;
    delete manifest.commonInfo.readme.body;
    delete manifest.commonInfo.readme.frontmatter;

    manifest.patternLibFiles = JSON.parse(JSON.stringify(patternLibFiles));

    manifest.userPatterns = JSON.parse(JSON.stringify(userPatterns));

    manifest.userPatterns.forEach((pattern, i) => {
      manifest.userPatterns[i].html.forEach((patternHtml, j) => {
        delete manifest.userPatterns[i].html[j].content;

        if (manifest.userPatterns[i].html[j].readme) {
          delete manifest.userPatterns[i].html[j].readme.desc;
          delete manifest.userPatterns[i].html[j].readme.description;
        }
      });

      manifest.userPatterns[i].md.forEach((patternHtml, j) => {
        delete manifest.userPatterns[i].md[j].content;
      });
    });

    manifest.config = JSON.parse(JSON.stringify(appPkg.config));

    // fs.writeFile(`${folderpath}/${appPkg.config.manifestFilename}`, JSON.stringify(manifest, null, 2), (e) => {
      return resolve(manifest);
    // });
  });
};

module.exports = {
  generate: generate,
};
