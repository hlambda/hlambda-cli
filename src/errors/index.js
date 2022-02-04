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
  },
  ERROR_INVALID_HLAMBDA_ADMIN_SECRET: {
    message: `Invalida hlambda admin secret! Check 'x-hlambda-admin-secret'.`,
  },

  // CLI errors
  ERROR_FS_READ_ERROR: {
    message: 'File system read error!',
  },
  ERROR_FOLDER_ALREADY_EXISTS: {
    message: 'Folder already exists!',
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
