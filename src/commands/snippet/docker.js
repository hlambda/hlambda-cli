import path from 'path';
import fetch from 'node-fetch';

import { errors } from './../../errors/index.js';

import CLIErrorHandler from './../../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../../utils/loadConfigFromYAML.js';

import { dockerInstallSnippet } from './install-snippets.js';

export const dockerSnippet = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    console.log(dockerInstallSnippet.yellow);
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default dockerSnippet;
