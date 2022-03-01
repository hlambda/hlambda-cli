import path from 'path';
import fetch from 'node-fetch';
// import FormData from 'form-data';
import { FormData, File } from 'formdata-node';

import { errors } from './../errors/index.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../utils/loadConfigFromYAML.js';

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

    // TODO: Implement this
    throw new Error(errors.FUNCTIONALITY_NOT_IMPLEMENTED);
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
