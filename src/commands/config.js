import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import fetch from 'node-fetch';

import { errors } from './../errors/index.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';
import YAWN from './../utils/YAWN.js';
import { loadConfigFromYAML } from './../utils/loadConfigFromYAML.js';

export const config = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:', cwd);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = options?.endpoint ?? configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    const configurationFilePath = path.resolve(cwd, options.config, 'config.yaml');

    const data = await readFile(configurationFilePath, 'utf8')
      .then((fileData) => {
        console.log(`Config`.green, `${configurationFilePath}`.yellow, `successfully loaded...`.green);
        return fileData;
      })
      .catch((error) => {
        console.error(`Config`.red, `${configurationFilePath.yellow}`, `errored out...`.red);
        // console.error(error);
        return undefined;
      });

    console.log(Array(80 + 1).join('-'));
    console.log(`Content of your config.yaml:`);
    console.log(Array(80 + 1).join('-'));
    console.log(data);
    console.log(Array(80 + 1).join('-'));
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default config;
