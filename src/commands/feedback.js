import path from 'path';
import open from 'open';

import CLIErrorHandler from './../utils/CLIErrorHandler.js';

export const leaveFeedback = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    console.log('Starting browser, opening Google form...'.green);
    open(`https://forms.gle/LCK2ueRYsnY88SXv9`);
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default leaveFeedback;
