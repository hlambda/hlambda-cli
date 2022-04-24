import path from 'path';
import { writeFile, mkdir, access, readFile } from 'fs/promises';
import editDotenv from 'edit-dotenv';

import { errors } from './../../errors/index.js';

import CLIErrorHandler from './../../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../../utils/loadConfigFromYAML.js';

import { configEnvTemplate } from './../../templates/index.js';

export const defaultEnv = async (envName, options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // Create env
    const initEnvFilePath = path.resolve(cwd, '.env');
    console.log(
      `Trying to update .env file and set default to environment ${envName}:`.green,
      `${initEnvFilePath}`.yellow
    );

    const { force, forceRemove } = options;
    const includeDemoApp = !options.clean; // Flip the clean flag.

    // We don't need to check for this because we presume that he knows what he is doing...
    const folderExists = await access(initEnvFilePath)
      .then((result) => {
        return true;
      })
      .catch((error) => {
        // console.log(error);
        // throw new Error(errors.ERROR_FS_READ_ERROR);
        return false;
      });

    // Check if the in the current cwd there is .env file, because the .env we load from current dir.
    // envName

    // Read .env value if exists
    const oldValueOfDotenvFile = await readFile(`${initEnvFilePath}`, 'utf-8')
      .then((data) => {
        // console.log(`File read ${initEnvFilePath} successfull!`.green);
        return data;
      })
      .catch(() => {
        console.log(`File read ${initEnvFilePath}failed`.red);
      });

    // Edit dotenv with the changes provided to us
    const newValueOfDotenvFile = editDotenv(oldValueOfDotenvFile, { ENV_DEFAULT_ENVIRONMENT: `"${envName}"` });

    // Save the new values to dotenv file to the local cwd
    // console.log(newValueOfDotenvFile);
    await writeFile(`${initEnvFilePath}`, newValueOfDotenvFile, 'utf-8')
      .then(() => {
        // console.log(`File write ${initEnvFilePath} successfull!`.green);
      })
      .catch(() => {
        console.log(`File write ${initEnvFilePath} failed`.red);
      });
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default defaultEnv;
