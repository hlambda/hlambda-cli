import path from 'path';

import { errors } from './../errors/index.js'; 

export const startConsole = async () => {
  (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:', cwd);

    console.log('Starting browser...');
    // TODO: Start the server and open browser

  })()
    .then(() => {})
    .catch((error) => { console.log('[Error]'.red, `${error.message}`.red); })
};

