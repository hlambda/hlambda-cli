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
  console.log(`Trying to load config file from:`.green, `${configurationFilePath}`.yellow);

  const configuration = await readFile(configurationFilePath, 'utf8')
    .then((fileData) => {
      const result = YAML.parse(fileData);
      // console.log(
      //   `[configuration loader] Config`.green,
      //   `${configurationFilePath}`.yellow,
      //   `successfully loaded...`.green
      // );
      return result;
    })
    .catch((error) => {
      // console.error(`[configuration loader] Config`.red, `${configurationFilePath.yellow}`, `errored out...`.red);
      // console.error(error);
      if (error.name === 'YAMLSemanticError') {
        throw Error(errors.ERROR_CONFIGURATION_YAML_FILE_IS_INVALID);
      }
      return undefined;
    });

  if (typeof configuration === 'undefined') {
    throw Error(errors.ERROR_CONFIGURATION_FILE_IS_MISSING);
  }

  // Check for ENV
  if (!(typeof options.env === 'undefined' || options.env === '')) {
    const configurationEnv = await readFile(
      path.resolve(cwd, options.config, 'environments', options.env, 'config.yaml'),
      'utf8'
    )
      .then((fileData) => {
        const result = YAML.parse(fileData);
        // console.log(
        //   `[configuration loader] Config`.green,
        //   `${configurationFilePath}`.yellow,
        //   `successfully loaded...`.green
        // );
        return result;
      })
      .catch((error) => {
        // console.error(`[configuration loader] Config`.red, `${configurationFilePath.yellow}`, `errored out...`.red);
        console.error(error);
        if (error.name === 'YAMLSemanticError') {
          throw Error(errors.ERROR_CONFIGURATION_YAML_FILE_IS_INVALID);
        }
        return undefined;
      });

    // TODO: Check if you need to replace admin secret with env value

    return {
      ...configuration,
      ...configurationEnv,
    };
  }

  return configuration;
};

export default loadConfigFromYAML;
