import path from 'path';
import { writeFile, mkdir, access } from 'fs/promises';
import rimraf from 'rimraf';

import { errors } from './../errors/index.js';
import init from './init.js';
import { metadataExport } from './metadata.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';

export const clone = async (dirName, url, options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    const cloneFilePath = path.resolve(cwd, dirName);
    console.log(`Trying to clone app in:`.green, `${cloneFilePath}`.yellow);

    const { force, forceRemove } = options;
    const includeDemoApp = !options.clean; // Flip the clean flag.

    const folderExists = await access(cloneFilePath)
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
            typeof cloneFilePath === 'string' &&
            cloneFilePath !== '' &&
            cloneFilePath !== '/' &&
            cloneFilePath !== '/*'
          ) {
            // Sanity check !!!
            console.log(`Removing everything inside ${cloneFilePath}`.red);
            rimraf.sync(`${cloneFilePath}/*`); // Please be careful...
          } else {
            throw new Error(errors.ERROR_DANGEROUS_SANITY_CHECK_DID_NOT_PASS);
          }
        }
      } else {
        throw new Error(errors.ERROR_FOLDER_ALREADY_EXISTS);
      }
    }

    // Call Init
    await init(dirName, options, program, true);

    // Write configuration .env with endpoint and admin secret values
    const adminSecret = options?.adminSecret ?? '';

    // !!! Important !!! Mutate options?.config to point inside hlapp
    // eslint-disable-next-line no-param-reassign
    options.config = `./${dirName}/`;

    const envTemplate = `# Remove "#" to uncomment the env values.
ENV_LOCAL_HLAMBDA_ENDPOINT="${url}"
ENV_LOCAL_HLAMBDA_ADMIN_SECRET="${adminSecret}"

# ENV_DEV_HLAMBDA_ENDPOINT="http://dev-server:8081"
# ENV_DEV_HLAMBDA_ADMIN_SECRET="demo-dev"

# ENV_DEFAULT_ENVIRONMENT="local"
`;

    await writeFile(`./${dirName}/.env`, envTemplate, 'utf-8')
      .then(() => {
        // console.log(`File write ${`./${dirName}/.env`} successfull!`.green);
      })
      .catch(() => {
        console.log(`File write ${`./${dirName}/.env`} failed`.red);
      });

    // Call metadata export
    await metadataExport(options, program);

    console.log(`Directory created.`.green);
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default clone;
