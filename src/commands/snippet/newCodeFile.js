import path from 'path';

import { writeFile, mkdir, access } from 'fs/promises';

import { errors } from './../../errors/index.js';

import CLIErrorHandler from './../../utils/CLIErrorHandler.js';
import { newCodeFileJavascriptRouter, newCodeFileJavascriptEntrypoint } from './file-snippets.js';

export const createNewSnippetCodeFile =
  (fileType = 'jsr') =>
  async (name, options, program) => {
    await (async () => {
      const cwd = path.resolve(process.cwd());
      console.log('Executing in cwd:'.green, `${cwd}`.yellow);

      const { force, path: routerPath, type } = options;
      console.log(options);

      const allowedTypes = 'get|post|put|delete|all'.split('|');
      if (!allowedTypes.includes(type)) {
        throw new Error(errors.ERROR_NOT_ALLOWED_METHOD_TYPE);
      }

      let contentOfTheNewFile = '';
      let nameOfTheNewFile = '';
      if (fileType === 'jsr') {
        contentOfTheNewFile = newCodeFileJavascriptRouter(name, routerPath, type);
        nameOfTheNewFile = `router.${name}.js`;
      } else if (fileType === 'jse') {
        contentOfTheNewFile = newCodeFileJavascriptEntrypoint(name);
        nameOfTheNewFile = `entrypoint.${name}.js`;
      } else {
        console.error(`Unknown file type ${fileType}`.red);
      }

      console.log(contentOfTheNewFile);

      // Construct the file path to the new file
      const newFilePath = path.resolve(cwd, `metadata`, /* add location in future, */ nameOfTheNewFile);
      console.log(`Trying to generate new file at: ${newFilePath}`);

      // Check if file exists
      const fileExists = await access(newFilePath)
        .then((result) => {
          return true;
        })
        .catch((error) => {
          // console.log(error);
          // throw new Error(errors.ERROR_FS_READ_ERROR);
          return false;
        });

      if (fileExists && !force) {
        console.error(`File exists, we do not want to overwrite anything...`.red);
      } else {
        if (force) {
          console.log('You choose the dangerous side of the force... we will overwrite files!'.yellow);
        }
        await writeFile(newFilePath, contentOfTheNewFile, 'utf-8')
          .then(() => {
            console.log(`File write ${newFilePath} successfull!`.green);
          })
          .catch(() => {
            console.log(`File write ${newFilePath} failed`.red);
          });
      }
    })()
      .then(() => {})
      .catch(CLIErrorHandler(program));
  };

export default createNewSnippetCodeFile;
