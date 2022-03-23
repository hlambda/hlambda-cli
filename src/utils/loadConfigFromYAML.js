import dotenv from 'dotenv';
import path from 'path';
import { readFile } from 'fs/promises';
import YAML from 'yaml';

import { errors } from './../errors/index.js';

const replaceValueWithProcessEnv = (_newConf, key) => {
  const strValue = _newConf?.[key] ?? '';

  const tSecret = strValue.match(/^{{(.+)}}$/m);
  const tempOne = {};
  if (tSecret) {
    console.log(`Override value for key: ${key} with value from process.env[${tSecret[1]}]`.yellow);
    tempOne[key] = process.env?.[tSecret[1]] ?? '';
  }

  // Idea to have namespacing for replacing values from different scopes.
  // Example; env.ENV_VARIABLE_VALUE, but for now it is good as is.

  // const tSecretEnv = strValue.match(/^{{env\.(.+)}}$/m);
  // const tempTwo = {};
  // if (tSecretEnv) {
  //   console.log(`Override value for key: env.${key} with value from process.env[${tSecretEnv[1]}]`.yellow);
  //   tempTwo[key] = process.env?.[tSecretEnv[1]] ?? '';
  // }

  return {
    ..._newConf,
    ...tempOne,
    // ...tempTwo,
  };
};

export const loadConfigFromYAML = async (options) => {
  const cwd = path.resolve(process.cwd());
  // console.log('[loadConfigFromYAML] Executing in cwd:', cwd);

  // Preload env values from .env
  dotenv.config({ path: path.resolve(cwd, options.config, '.env') });

  // Load yaml configuration
  // TODO: Maybe check for both .yaml and .yml in future...
  const configurationFilePath = path.resolve(cwd, options.config, 'config.yaml');
  console.log(`Trying to load config file from:`.green, `${configurationFilePath}`.yellow);

  let configuration = await readFile(configurationFilePath, 'utf8')
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
    const configurationEnvFilePath = path.resolve(cwd, options.config, 'environments', options.env, 'config.yaml');

    console.log(`Trying to load config file from env:`.green, `${configurationEnvFilePath}`.yellow);

    const configurationEnv = await readFile(configurationEnvFilePath, 'utf8')
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

    if (typeof configurationEnv === 'undefined') {
      throw Error(errors.ERROR_CONFIGURATION_ENV_FILE_IS_MISSING);
    }

    let newConf = {
      ...configuration,
      ...configurationEnv,
    };

    // Check if you need to replace admin secret with env value
    newConf = replaceValueWithProcessEnv(newConf, 'admin_secret');
    newConf = replaceValueWithProcessEnv(newConf, 'endpoint');

    return newConf;
  }

  configuration = replaceValueWithProcessEnv(configuration, 'admin_secret');
  configuration = replaceValueWithProcessEnv(configuration, 'endpoint');

  return configuration;
};

export default loadConfigFromYAML;
