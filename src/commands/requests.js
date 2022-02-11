import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import fetch from 'node-fetch';

import { errors } from './../errors/index.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../utils/loadConfigFromYAML.js';

export const requests = (method) => async (route, options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:', cwd);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = options?.endpoint ?? configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';
    const headers = {
      'x-hlambda-admin-secret': adminSecret,
    };

    console.log(Array(80 + 1).join('-'));
    console.log(`curl -s -X ${method} ${endpoint}/${route}`);
    console.log(Array(80 + 1).join('-'));

    if (!options?.dryRun) {
      const response = await fetch(`${endpoint}/${route}`, {
        method,
        headers,
      });

      const responseBodyText = await response.text();

      console.log('Response HTTP status:', response.status);
      console.log(Array(80 + 1).join('-'));
      console.log(responseBodyText);
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default requests;
