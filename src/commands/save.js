import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import fetch from 'node-fetch';

import { errors } from './../errors/index.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';
import YAWN from './../utils/YAWN.js';
import { loadConfigFromYAML } from './../utils/loadConfigFromYAML.js';

export const save = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:', cwd);

    // Load yaml configuration
    const configuration = await loadConfigFromYAML(options);

    const endpoint = options?.endpoint ?? configuration?.endpoint ?? 'http://localhost:8081';
    const adminSecret = options?.adminSecret ?? configuration?.admin_secret ?? '';

    const configurationFilePath = path.resolve(cwd, options.config, 'config.yaml');

    const yawn = await readFile(configurationFilePath, 'utf8')
      .then((fileData) => {
        const result = new YAWN(fileData);
        console.log(`[yawn] Config`.green, `${configurationFilePath}`.yellow, `successfully loaded...`.green);
        return result;
      })
      .catch((error) => {
        console.error(`[yawn] Config`.red, `${configurationFilePath.yellow}`, `errored out...`.red);
        // console.error(error);
        return undefined;
      });

    yawn.json = { ...yawn.json, endpoint, admin_secret: adminSecret };

    // console.log(yawn.yaml);

    await writeFile(configurationFilePath, yawn.yaml, 'utf-8')
      .then(() => {
        console.log(
          `[configuration saver] Config`.green,
          `${configurationFilePath}`.yellow,
          `successfully saved...`.green
        );
      })
      .catch((error) => {
        console.error(`[configuration saver] Config`.red, `${configurationFilePath.yellow}`, `errored out...`.red);
        // console.error(error);
        return undefined;
      });

    console.log('Configuration updated!');
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default save;
