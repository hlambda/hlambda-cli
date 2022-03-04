import path from 'path';
import fetch from 'node-fetch';
import * as readline from 'readline';
import { stdin as input, stdout as output } from 'process';

import { FormData, File } from 'formdata-node';

import { errors } from './../errors/index.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../utils/loadConfigFromYAML.js';
import executeShellCommandClass from './../utils/executeShellCommandClass.js';

export const serverGetLogs = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    const headers = {
      'x-hlambda-admin-secret': adminSecret,
    };
    const response = await fetch(`${endpoint}/console/api/v1/logs?type=json`, {
      method: 'GET',
      // body: formData,
      headers,
    });

    if (response.status === 200) {
      console.log('Logs loaded!'.green);
    }
    console.log(response.status);

    try {
      // Crazy but it works perfectly...
      console.log(`${JSON.parse(JSON.parse(await response.text())).join('\n')}`);
    } catch (error) {
      // console.error(error);
      throw new Error(errors.ERROR_WHILE_FETCHING_LOGS_FROM_SERVER);
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export const serverGetErrors = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    const headers = {
      'x-hlambda-admin-secret': adminSecret,
    };
    const response = await fetch(`${endpoint}/console/api/v1/errors`, {
      method: 'GET',
      // body: formData,
      headers,
    });

    if (response.status === 200) {
      console.log('Errors loaded!'.green);
    }
    console.log(response.status);

    try {
      console.log(JSON.stringify(JSON.parse(await response.text()), null, 2));
    } catch (error) {
      console.error(error);
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export const serverGetConstants = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    const headers = {
      'x-hlambda-admin-secret': adminSecret,
    };
    const response = await fetch(`${endpoint}/console/api/v1/constants`, {
      method: 'GET',
      // body: formData,
      headers,
    });

    if (response.status === 200) {
      console.log('Errors constants!'.green);
    }
    console.log(response.status);

    try {
      console.log(JSON.stringify(JSON.parse(await response.text()), null, 2));
    } catch (error) {
      console.error(error);
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export const serverShell = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    const headers = {
      'x-hlambda-admin-secret': adminSecret,
    };
    const response = await fetch(`${endpoint}/console/api/v1/command-cwd`, {
      method: 'GET',
      headers,
    });

    if (response.status === 200) {
      console.log('Connection valid!'.green);
    } else {
      throw new Error(errors.ERROR_INVALID_HLAMBDA_ADMIN_SECRET);
    }
    console.log(response.status);
    const cwdCommandResult = await response.json();

    const executeShellCommand = executeShellCommandClass(adminSecret, endpoint, true);

    let workingDirectory = cwdCommandResult?.cwd ?? './';

    const writePwdConsole = () => {
      process.stdout.write(`<${'hlambda-server'}@${endpoint}> ${workingDirectory} # `.yellow);
    };
    writePwdConsole();

    // Register linebyline listener
    const rl = readline.createInterface({ input, output });

    // const answer = await rl.question('What do you think of Node.js? ');
    // console.log(`Thank you for your valuable feedback: ${answer}`);

    rl.on('line', async (terminalInput) => {
      if (terminalInput.toLowerCase() === 'exit' || terminalInput.toLowerCase() === 'quit') {
        rl.close();
        process.exit(0);
        return;
      }
      if (terminalInput.toLowerCase().startsWith('cd')) {
        // Change working dir for the command...
        const t = terminalInput.match(/cd\s(.+)/);
        const responseCd = await fetch(`${endpoint}/console/api/v1/command-change-dir`, {
          method: 'POST',
          headers: {
            'x-hlambda-admin-secret': adminSecret,
            Accept: 'application/json',
            'Content-Type': 'application/json', // Important
          },
          body: JSON.stringify({
            path: t[1],
          }),
        });
        const responseJson = await responseCd.json();
        const outputString = responseJson;
        // console.log(outputString);
        workingDirectory = outputString?.cwd;
        writePwdConsole();
        return;
      }
      const result = await executeShellCommand(terminalInput, workingDirectory);
      const data = await result.json();
      process.stdout.write(data?.data);
      writePwdConsole();
    });
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export const serverNPMInstall = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    // TODO: Implement this
    throw new Error(errors.FUNCTIONALITY_NOT_IMPLEMENTED);
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default serverGetLogs;
