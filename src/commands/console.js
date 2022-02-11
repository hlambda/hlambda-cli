import path from 'path';
import { readFile } from 'fs/promises';
import YAML from 'yaml';

import open from 'open';

import { errors } from './../errors/index.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';

export const startConsole = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:', cwd);

    // TODO: Maybe check for both .yaml and .yml in future...
    const configurationFilePath = path.resolve(cwd, options.config, 'config.yaml');
    const configuration = await readFile(configurationFilePath, 'utf8')
      .then((fileData) => {
        const result = YAML.parse(fileData);
        console.log(
          `[configuration loader] Config`.green,
          `${configurationFilePath}`.yellow,
          `successfully loaded...`.green
        );
        return result;
      })
      .catch((error) => {
        console.error(`[configuration loader] Config`.red, `${configurationFilePath.yellow}`, `errored out...`.red);
        // console.error(error);
        return undefined;
      });
    if (typeof configuration === 'undefined') {
      throw Error(errors.ERROR_CONFIGURATION_FILE_IS_MISSING);
    }

    const endpoint = configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    console.log('Starting browser...');

    // Sanity check to not execute open on evilCalc.exe :) , we only open URLS that start with `http://` or `https://`
    if (`${endpoint}/console`.match(/^https?:\/\//g)) {
      open(`${endpoint}/console`);
    } else {
      throw new Error(errors.ERROR_INVALID_ENDPOINT_URL);
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default startConsole;
