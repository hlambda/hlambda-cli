import path from 'path';
import fetch from 'node-fetch';
import { readFileSync } from 'fs';

import { errors } from './../errors/index.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';

export const checkForNewVersion = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    async function checkVersionOnNPMRegistry(name) {
      const endpoint = `https://registry.npmjs.org/${name}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      return data?.['dist-tags']?.latest;
    }

    let pckg;
    try {
      const packageJsonRawData = readFileSync(new URL('./../../package.json', import.meta.url));
      pckg = JSON.parse(packageJsonRawData);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }

    const latestVersion = await checkVersionOnNPMRegistry('hlambda-cli');

    console.log(
      `You are running the ${pckg.version} version of Hlambda CLI, the latest version is: ${latestVersion}
You can update your Hlambda CLI by running:

  npm install -g hlambda-cli

`.yellow
    );
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
