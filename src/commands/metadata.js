import path from 'path';

import { errors } from './../errors/index.js'; 

export const metadataApply = async () => {
  (async () => {
    const cwd = path.resolve(process.cwd());
    // console.log('Executing in cwd:', cwd);

    console.log('Command still in development!');
    console.log('Apply metadata!');
    // TODO: Start the server and open browser

  })()
    .then(() => {})
    .catch((error) => { console.log('[Error]'.red, `${error.message}`.red); })
};

export const metadataExport = async () => {
  (async () => {
    const cwd = path.resolve(process.cwd());
    // console.log('Executing in cwd:', cwd);

    console.log('Command still in development!');
    console.log('Export metadata!');

  })()
    .then(() => {})
    .catch((error) => { console.log('[Error]'.red, `${error.message}`.red); })
};
