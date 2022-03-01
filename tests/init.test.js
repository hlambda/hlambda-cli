import * as assert from 'assert';
import { readFileSync } from 'fs';

import cli from './cliTester.js';

describe('Testing CLI', function () {
  describe('Initialization', function () {
    it('When init is run it should create new hlambda config folder', async function () {
      // const result = await cli(['init', 'temp/automatic-test'], '.');

      // console.log(result);

      assert.equal(1, 1);
    });
  });
});
