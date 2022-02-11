import path from 'path';
import { readFile } from 'fs/promises';
import YAML from 'yaml';

import { errors } from './../errors/index.js';

export const loadConfigFromYAML = async (options) => {
  const cwd = path.resolve(process.cwd());
  // console.log('[loadConfigFromYAML] Executing in cwd:', cwd);

  // Load yaml configuration
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
      // console.error(`[configuration loader] Config`.red, `${configurationFilePath.yellow}`, `errored out...`.red);
      // console.error(error);
      return undefined;
    });

  if (typeof configuration === 'undefined') {
    throw Error(errors.ERROR_CONFIGURATION_FILE_IS_MISSING);
  }

  return configuration;
};

export default loadConfigFromYAML;
