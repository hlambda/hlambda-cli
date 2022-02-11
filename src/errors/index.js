import { createErrorDescriptor } from 'hlambda';

// --- START SAFE TO EDIT ---

export const errorsGroupName = 'hlambda-cli';

export const errors = {
  FUNCTIONALITY_NOT_IMPLEMENTED: {
    message:
      'Specific functionality is still in development. (It should be available soon, thank you for understanding.)',
  },
  ERROR_PAGE_NOT_FOUND: {
    message: 'Requested endpoint does not exist.',
  },

  // Hlambda
  ERROR_HLAMBDA_ADMIN_SECRET_DISABLED: {
    message: 'Admin secret is disabled.',
    exitCode: 13,
  },
  ERROR_INVALID_HLAMBDA_ADMIN_SECRET: {
    message: `Invalida hlambda admin secret! Check 'x-hlambda-admin-secret' header, for CLI please check if --admin-secret is correct and/or value in your config.yaml file.`,
    exitCode: 42,
  },

  // CLI errors
  ERROR_FS_READ_ERROR: {
    message: 'File system read error!',
    exitCode: 1,
  },
  ERROR_CONFIGURATION_FILE_IS_MISSING: {
    message: 'Configuration file is missing, please check your cwd path or use --config flag to pass config path.',
    exitCode: 2,
  },
  ERROR_FOLDER_ALREADY_EXISTS: {
    message: 'Folder already exists!',
    exitCode: 3,
  },
  ERROR_INVALID_ENDPOINT_URL: {
    message: 'Endpoint URL does not start with http:// or https:// please verify the endpoint value in config.yaml',
    exitCode: 4,
  },

  // Special errors
  UNKNOWN_ERROR: {
    message: 'Unknown server error.',
    handler: () => {
      console.error(
        '[ERROR]: DANGER! Unknown error was detected! Please define all known error states and handle them accordingly!'
      );
    },
  },
};

// --- STOP SAFE TO EDIT ---

export const ed = createErrorDescriptor(errors, errorsGroupName, false);

export default errors;
