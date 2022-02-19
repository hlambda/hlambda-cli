import path from 'path';
import fetch from 'node-fetch';
// import FormData from 'form-data';
import { FormData, File } from 'formdata-node';

import { errors } from './../errors/index.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../utils/loadConfigFromYAML.js';

export const checkForNewVersion = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // TODO: Implement this
    throw new Error(errors.FUNCTIONALITY_NOT_IMPLEMENTED);
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export const checkWhatIsNewInCurrentVersion = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // TODO: Implement this
    throw new Error(errors.FUNCTIONALITY_NOT_IMPLEMENTED);
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default checkForNewVersion;
