'use strict';

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

let appPkg = require(`${__dirname}/../../../package.json`);

const generate = function (folderpath, manifest) {
  return new Promise((resolve, reject) => {
    const includesJsPath = path.resolve(`${__dirname}/../../../patternbot-includes/index.js`);
    const outPath = path.resolve(`${folderpath}${appPkg.config.commonFolder}/${appPkg.config.includesFilename}`);

    fs.readFile(includesJsPath, 'utf8', (e, patternBotIncludesFunction) => {
      const manifestTmpFilename = `patternManifest_${Date.now()}`;
      const manifestJson = JSON.stringify(manifest, null, 2);
      const outFileBits = [
        '(function () {',
        patternBotIncludesFunction,
        '',
        '/** ',
        ' * Patternbot library manifest',
        ` * ${folderpath}`,
        ` * @version ${Date.now()}`,
        ' */',
        `const ${manifestTmpFilename} = ${manifestJson};`,
        '',
        `patternBotIncludes(${manifestTmpFilename});`,
        '}());',
      ];

      fse.ensureDir(`${folderpath}${appPkg.config.commonFolder}`);
      fs.writeFile(outPath, outFileBits.join('\n'), (e) => {
        resolve();
      });
    });
  });
};

module.exports = {
  generate: generate,
};
