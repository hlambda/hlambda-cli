import * as assert from 'assert';
import { readFileSync } from 'fs';

import cli from './cliTester.js';

describe('Testing CLI', function () {
  describe('Version flag', function () {
    it('It should be the version of the package json when passing -v', async function () {
      const result = await cli(['-v'], '.');

      let pckg;
      try {
        const packageJsonRawData = readFileSync(new URL('./../package.json', import.meta.url));
        pckg = JSON.parse(packageJsonRawData);
      } catch (error) {
        console.log(error);
      }

      assert.equal(result.stdout, `${pckg.version}\n`);
    });
    it('It should be the version of the package json when passing --version', async function () {
      const result = await cli(['--version'], '.');

      let pckg;
      try {
        const packageJsonRawData = readFileSync(new URL('./../package.json', import.meta.url));
        pckg = JSON.parse(packageJsonRawData);
      } catch (error) {
        console.log(error);
      }

      assert.equal(result.stdout, `${pckg.version}\n`);
    });
  });
  describe('Version alias', function () {
    it('It should be the version of the package json when calling version command', async function () {
      const result = await cli(['version'], '.');

      let pckg;
      try {
        const packageJsonRawData = readFileSync(new URL('./../package.json', import.meta.url));
        pckg = JSON.parse(packageJsonRawData);
      } catch (error) {
        console.log(error);
      }

      assert.equal(result.stdout, `${pckg.version}\n`);
    });
    it('It should be the version of the package json when calling version command alias v', async function () {
      const result = await cli(['v'], '.');

      let pckg;
      try {
        const packageJsonRawData = readFileSync(new URL('./../package.json', import.meta.url));
        pckg = JSON.parse(packageJsonRawData);
      } catch (error) {
        console.log(error);
      }

      assert.equal(result.stdout, `${pckg.version}\n`);
    });
  });
});
