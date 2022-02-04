import path from 'path';
import { writeFile, mkdir, access } from 'fs/promises';

import { errors } from './../errors/index.js'; 
import { configTemplate, packageJsonTemplate, gitignoreTemplate, routerDemoJsTemplate, errorTemplate, hlambdaYamlTemplate } from './../templates/index.js';

export const init = async (dirName, options) => {
  (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:', cwd);

    const includeDemoApp = !options.clean; // Flip the clean flag.

    const folderExists = await access(`./${dirName}`)
      .then((result) => {
        return true;
      })
      .catch((error) => {
        // console.log(error);
        //throw new Error(errors.ERROR_FS_READ_ERROR);
        return false;
      });
    if (folderExists){
      throw new Error(errors.ERROR_FOLDER_ALREADY_EXISTS);
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
        console.log(`Create folder failed`.red);
      });

    await writeFile(`./${dirName}/config.yaml`, configTemplate, 'utf-8')
      .then(() => {
        // console.log(`File write ${`./${dirName}/config.yaml`} successfull!`.green);
      })
      .catch(() => {
        console.log(`File write ${`./${dirName}/config.yaml`} failed`.red);
      });

    if (includeDemoApp) {
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

    console.log(
      `directory created. execute the following commands to continue:\n\n  cd ${dirName}\n  hlambda console\n`);
  })()
    .then(() => {})
    .catch((error) => { console.log('[Error]'.red, `${error.message}`.red); })
};

