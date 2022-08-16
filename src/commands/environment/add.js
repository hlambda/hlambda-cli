import path from 'path';
import { writeFile, mkdir, access } from 'fs/promises';
import rimraf from 'rimraf';

import { errors } from './../../errors/index.js';

import CLIErrorHandler from './../../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../../utils/loadConfigFromYAML.js';

import { configEnvTemplate } from './../../templates/index.js';

export const addEnv = async (envName, options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // Create env
    const initEnvFilePath = path.resolve(cwd, options.config, 'environments', envName);
    console.log(`Trying to add new environment ${envName}:`.green, `${initEnvFilePath}`.yellow);

    const { force, forceRemove } = options;
    const includeDemoApp = !options.clean; // Flip the clean flag.

    const folderExists = await access(initEnvFilePath)
      .then((result) => {
        return true;
      })
      .catch((error) => {
        // console.log(error);
        // throw new Error(errors.ERROR_FS_READ_ERROR);
        return false;
      });
    if (folderExists) {
      if (force) {
        if (forceRemove) {
          if (
            typeof initEnvFilePath === 'string' &&
            initEnvFilePath !== '' &&
            initEnvFilePath !== '/' &&
            initEnvFilePath !== '/*'
          ) {
            // Sanity check !!!
            console.log(`Removing everything inside ${initEnvFilePath}`.red);
            rimraf.sync(`${initEnvFilePath}/*`); // Please be careful...
          } else {
            throw new Error(errors.ERROR_DANGEROUS_SANITY_CHECK_DID_NOT_PASS);
          }
        }
      } else {
        throw new Error(errors.ERROR_ENV_ALREADY_EXISTS);
      }
    }

    await mkdir(initEnvFilePath, { recursive: true })
      .then(() => {
        // console.log(`Created folder!`.green);
      })
      .catch((error) => {
        console.log(`Create folder failed`.red);
      });

    await writeFile(`${initEnvFilePath}/config.yaml`, configEnvTemplate(envName), 'utf-8')
      .then(() => {
        // console.log(`File write ${initEnvFilePath}/config.yaml successfull!`.green);
      })
      .catch(() => {
        console.log(`File write ${initEnvFilePath}/config.yaml failed`.red);
      });
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default addEnv;
