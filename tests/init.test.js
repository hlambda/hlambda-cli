import * as assert from 'assert';
import { readFileSync } from 'fs';
import { writeFile, mkdir, access } from 'fs/promises';
import path from 'path';
import rimraf from 'rimraf';
import 'colors';

import cli from './cliTester.js';
import { errors } from './../src/errors/index.js';

describe('Testing CLI', function () {
  describe('Initialization', function () {
    it('When init is run it should create new hlambda config folder', async function () {
      const testingFolder = 'temp/automatic-test';

      const cwd = path.resolve(process.cwd());
      const initFilePath = path.resolve(cwd, testingFolder);

      const result = await cli(['init', testingFolder], '.');

      // Check if the new folder is present
      const folderExists = await access(initFilePath)
        .then((result) => {
          return true;
        })
        .catch((error) => {
          // console.log(error);
          // throw new Error(errors.ERROR_FS_READ_ERROR);
          return false;
        });

      assert.equal(folderExists, true);
      // Clear path
      if (
        typeof initFilePath === 'string' &&
        initFilePath !== '' &&
        initFilePath !== '/' &&
        initFilePath !== '/*'
      ) {
        // Sanity check !!!
        // console.log(`Removing everything inside ${initFilePath}`.red);
        rimraf.sync(`${initFilePath}`); // Please be careful...
      } else {
        throw new Error(errors.ERROR_DANGEROUS_SANITY_CHECK_DID_NOT_PASS);
      }
    });
  });
});
