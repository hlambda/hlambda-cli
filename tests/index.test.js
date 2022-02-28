import * as assert from 'assert';
import path from 'path';
import { exec } from 'child_process';
import { readFileSync } from 'fs';

function cli(args, cwd) {
  return new Promise((resolve) => {
    exec(`node ${path.resolve('./src/index.js')} ${args.join(' ')}`, { cwd }, (error, stdout, stderr) => {
      resolve({
        code: error && error.code ? error.code : 0,
        error,
        stdout,
        stderr,
      });
    });
  });
}

describe('Testing CLI', function () {
  describe('Version', function () {
    it('It should be the version of the package json', async function () {
      let result = await cli(['-v'], '.');

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
