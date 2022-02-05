import path from 'path';
import { readFile } from 'fs/promises';
import YAML from 'yaml';

import open from 'open';

import { errors } from './../errors/index.js';

export const startConsole = async (options) => {
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

    // TODO: I have issue with this because if in yaml file endpoint is defined as `evilCalc.exe` it will open random executable,
    // is this security issue or just concearn that dev should receive warning for? (also it contains `/console` but that can be skipped)
    open(`${endpoint}/console`);
  })()
    .then(() => {})
    .catch((error) => {
      console.log('[Error]'.red, `${error.message}`.red);
    });
};

export default startConsole;
