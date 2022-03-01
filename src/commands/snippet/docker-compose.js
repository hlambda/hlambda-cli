import path from 'path';

import CLIErrorHandler from './../../utils/CLIErrorHandler.js';

import { dockerComposeInstallSnippet } from './install-snippets.js';

export const dockerComposeSnippet = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    console.log(dockerComposeInstallSnippet.yellow);
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default dockerComposeSnippet;
