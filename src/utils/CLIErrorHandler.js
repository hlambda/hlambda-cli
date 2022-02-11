const CLIErrorHandler = (program) => (error) => {
  // console.log('[Error]'.red, `${error.message}`.red);

  let errorOut = {};

  let parsed = {};
  try {
    parsed = JSON.parse(error.message);
    errorOut = {
      ...parsed,
    };
  } catch (e) {
    errorOut.code = 'UNKNOWN_ERROR';
    errorOut.exitCode = 404;
    errorOut.message = typeof error.message === 'string' ? error.message : JSON.stringify(error.message, null, 2);

    console.error('[ERROR] Edge case | Unknown error, please define the error and cover the edge case.'.red);
    console.error(error.stack);
  }

  program.error(`${errorOut.message}`.red, { ...errorOut });
};

export default CLIErrorHandler;
