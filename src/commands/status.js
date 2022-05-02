import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import fetch from 'node-fetch';

import { errors } from './../errors/index.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../utils/loadConfigFromYAML.js';

export const status = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    // Load yaml configuration (But this time catch error because even if the status is run where config is not selected we want to have output)
    const configuration = await loadConfigFromYAML(options)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        try {
          console.log(JSON.parse(error.message).message.red);
        } catch (e) {
          console.log('Unknown error while reading configuration file.'.red);
          console.log(error);
        }
      });

    const endpoint = options?.endpoint ?? configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    // Check the current environment state
    // console.log(`Configuration: ${JSON.stringify(configuration, null, 2)}`);
    console.log(`Environment selected: ${options.env ?? '-'}`);
    console.log(`Endpoint: ${endpoint ?? '-'}`);
    if (options.unsafe) {
      console.log(`Admin secret: ${adminSecret}`);
    } else {
      console.log(
        `Admin secret: ${
          adminSecret
            .split('')
            .map((item, index) => {
              return index === 0 ? item : '*';
            })
            .join('') ?? '-'
        }`
      );
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default status;
