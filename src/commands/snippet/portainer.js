import path from 'path';
import { exec } from 'child_process';

import CLIErrorHandler from './../../utils/CLIErrorHandler.js';

import { portainerInstallSnippet } from './install-snippets.js';

export const portainerSnippet = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    if (options.run) {
      const command = portainerInstallSnippet(true);
      const childPid = exec(command);

      childPid.stdout.on('data', (data) => {
        console.log(`${data.toString()}`);
      });

      childPid.stderr.on('data', (data) => {
        console.log(`${data.toString()}`);
      });

      childPid.on('exit', (code) => {
        console.log(`Process exited with code ${code.toString()}`);
      });
    } else if (options.clean) {
      console.log(portainerInstallSnippet(true));
    } else {
      console.log(portainerInstallSnippet().yellow);
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default portainerSnippet;
