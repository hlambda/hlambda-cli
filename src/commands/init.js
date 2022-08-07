import path from 'path';
import { writeFile, mkdir, access } from 'fs/promises';
import rimraf from 'rimraf';

import { errors } from './../errors/index.js';
import {
  configTemplate,
  packageJsonTemplate,
  gitignoreTemplate,
  routerDemoJsTemplate,
  errorTemplate,
  hlambdaYamlTemplate,
  hlambdaREADMETemplate,
  rootGitIgnoreTemplate,
  rootDotenvTemplate,
} from './../templates/index.js';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';

export const init = async (dirName, options, program, silent = false) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    const initFilePath = path.resolve(cwd, dirName);
    console.log(`Trying to initialize app in:`.green, `${initFilePath}`.yellow);

    const { force, forceRemove } = options;
    const includeDemoApp = !options.clean; // Flip the clean flag.

    const folderExists = await access(initFilePath)
      .then((result) => {
        return true;
      })
      .catch((error) => {
        // console.log(error);
        // throw new Error(errors.ERROR_FS_READ_ERROR);
        return false;
      });
    if (folderExists) {
      if (force) {
        if (forceRemove) {
          if (
            typeof initFilePath === 'string' &&
            initFilePath !== '' &&
            initFilePath !== '/' &&
            initFilePath !== '/*'
          ) {
            // Sanity check !!!
            console.log(`Removing everything inside ${initFilePath}`.red);
            rimraf.sync(`${initFilePath}/*`); // Please be careful...
          } else {
            throw new Error(errors.ERROR_DANGEROUS_SANITY_CHECK_DID_NOT_PASS);
          }
        }
      } else {
        throw new Error(errors.ERROR_FOLDER_ALREADY_EXISTS);
      }
    }

    await mkdir(`./${dirName}`, { recursive: true })
      .then(() => {
        // console.log(`Created folder!`.green);
      })
      .catch((error) => {
        console.log(`Create folder failed`.red);
      });

    // Create metadata folder
    await mkdir(`./${dirName}/metadata`, { recursive: true })
      .then(() => {
        // console.log(`Created folder!`.green);
      })
      .catch(() => {
        console.log(`Create metadata folder failed`.red);
      });

    // Create environments folder
    await mkdir(`./${dirName}/environments`, { recursive: true })
      .then(() => {
        // console.log(`Created folder!`.green);
      })
      .catch(() => {
        console.log(`Create environments folder failed`.red);
      });

    await writeFile(`./${dirName}/config.yaml`, configTemplate, 'utf-8')
      .then(() => {
        // console.log(`File write ${`./${dirName}/config.yaml`} successfull!`.green);
      })
      .catch(() => {
        console.log(`File write ${`./${dirName}/config.yaml`} failed`.red);
      });

    await writeFile(`./${dirName}/.gitignore`, rootGitIgnoreTemplate, 'utf-8')
      .then(() => {
        // console.log(`File write ${`./${dirName}/.gitignore`} successfull!`.green);
      })
      .catch(() => {
        console.log(`File write ${`./${dirName}/.gitignore`} failed`.red);
      });

    await writeFile(`./${dirName}/.env`, rootDotenvTemplate, 'utf-8')
      .then(() => {
        // console.log(`File write ${`./${dirName}/.env`} successfull!`.green);
      })
      .catch(() => {
        console.log(`File write ${`./${dirName}/.env`} failed`.red);
      });

    if (includeDemoApp) {
      await writeFile(`./${dirName}/README.md`, hlambdaREADMETemplate, 'utf-8')
        .then(() => {
          // console.log(`File write ${`./${dirName}/README.md`} successfull!`.green);
        })
        .catch(() => {
          console.log(`File write ${`./${dirName}/README.md`} failed`.red);
        });

      await writeFile(`./${dirName}/metadata/package.json`, packageJsonTemplate, 'utf-8')
        .then(() => {
          // console.log(`File write ${`./${dirName}/metadata/package.json`} successfull!`.green);
        })
        .catch(() => {
          console.log(`File write ${`./${dirName}/metadata/package.json`} failed`.red);
        });

      await writeFile(`./${dirName}/metadata/.gitignore`, gitignoreTemplate, 'utf-8')
        .then(() => {
          // console.log(`File write ${`./${dirName}/metadata/.gitignore`} successfull!`.green);
        })
        .catch(() => {
          console.log(`File write ${`./${dirName}/metadata/.gitignore`} failed`.red);
        });

      await mkdir(`./${dirName}/metadata/apps/example_demo_app`, { recursive: true })
        .then(() => {
          // console.log(`Created folder!`.green);
        })
        .catch(() => {
          console.log(`Create folder failed`.red);
        });

      await writeFile(`./${dirName}/metadata/apps/example_demo_app/router.demo.js`, routerDemoJsTemplate, 'utf-8')
        .then(() => {
          // console.log(`File write ${`./${dirName}/metadata/apps/example_demo_app/router.demo.js`} successfull!`.green);
        })
        .catch(() => {
          console.log(`File write ${`./${dirName}/metadata/apps/example_demo_app/router.demo.js`} failed`.red);
        });

      await writeFile(`./${dirName}/metadata/apps/example_demo_app/errors.demo.js`, errorTemplate, 'utf-8')
        .then(() => {
          // console.log(`File write ${`./${dirName}/metadata/apps/example_demo_app/errors.demo.js`} successfull!`.green);
        })
        .catch(() => {
          console.log(`File write ${`./${dirName}/metadata/apps/example_demo_app/errors.demo.js`} failed`.red);
        });

      await writeFile(`./${dirName}/metadata/apps/example_demo_app/hlambda-config.yaml`, hlambdaYamlTemplate, 'utf-8')
        .then(() => {
          // console.log(`File write ${`./${dirName}/metadata/apps/example_demo_app/hlambda-config.yaml`} successfull!`.green);
        })
        .catch(() => {
          // console.log(`File write ${`./${dirName}/metadata/apps/example_demo_app/hlambda-config.yaml`} failed`.red);
        });
    }

    if (!silent) {
      console.log(
        `Directory created. Execute the following commands to continue:`.green,
        `\n\n  ${'cd'.green} ${dirName}\n  ${'hlambda'.green} console\n`
      );
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default init;
