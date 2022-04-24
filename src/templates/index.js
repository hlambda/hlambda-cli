export const configTemplate = `version: 1
metadata_directory: metadata
endpoint: "{{ENV_LOCAL_HLAMBDA_ENDPOINT}}"
admin_secret: "{{ENV_LOCAL_HLAMBDA_ADMIN_SECRET}}"

# endpoint: "http://localhost:8081"
# admin_secret: demo

# metadata_post_apply_script:
#   - npm install --only=production

# metadata_apply_ignore:
#   - node_modules/
#   - .git/

# metadata_git_repository_sync_interval: ""
# metadata_git_repository: ""
# metadata_git_repository_access: ""

`;

export const rootDotenvTemplate = `# Remove "#" to uncomment the env values.
ENV_LOCAL_HLAMBDA_ENDPOINT="http://localhost:8081"
ENV_LOCAL_HLAMBDA_ADMIN_SECRET="demo"

# ENV_DEV_HLAMBDA_ENDPOINT="http://dev-server:8081"
# ENV_DEV_HLAMBDA_ADMIN_SECRET="demo-dev"

# ENV_DEFAULT_ENVIRONMENT="local"
`;

export const rootGitIgnoreTemplate = `.env
`;

export const configEnvTemplate = (envName) => {
  return `version: 1
endpoint: "{{ENV_${`${envName}`.toUpperCase()}_HLAMBDA_ENDPOINT}}"
admin_secret: "{{ENV_${`${envName}`.toUpperCase()}_HLAMBDA_ADMIN_SECRET}}"
`;
};

export const packageJsonTemplate = `{
  "type": "module",
  "dependencies": {}
}
`;

export const gitignoreTemplate = `node_modules/
`;

export const routerDemoJsTemplate = `import express from 'express';
import asyncHandler from 'express-async-handler';

// Execute GraphQL calls
import { executeWithAdminRights } from 'hlambda';

import errors from './errors.demo.js';

// Create express router
const router = express.Router();

router.get(
  '/demo',
  asyncHandler((req, res) => {
    res.send(\`Demo app works! \\nSPECIAL_ENV_VARIABLE: \${process.env.SPECIAL_ENV_VARIABLE}\`);
  })
);

export default router;

`;

export const errorTemplate = `import { createErrorDescriptor } from 'hlambda';

// --- START SAFE TO EDIT ---

export const errorsGroupName = 'demo-hlambda-app';

export const errors = {
  FUNCTIONALITY_NOT_IMPLEMENTED: {
    message:
      'Specific functionality is still in development. (It should be available soon, thank you for understanding.)',
  },
  SOMETHING_WENT_TERRIBLY_WRONG: {
    message: 'Description of an error message...',
  },
};

// --- STOP SAFE TO EDIT ---

export const ed = createErrorDescriptor(errors, errorsGroupName);

export default errors;

`;

export const hlambdaYamlTemplate = `# Defines if the app is enabled or not disabled apps are skipped from importing
enabled: true
# Defines if we want to use namespace or not
use_namespace: true
# Define the namespace name
namespace_name: 'demo_app'
# Custom environment variables override for our app
env:
  HASURA_GRAPHQL_API_ENDPOINT: "http://graphql-engine:8081/v1/graphql"
  HASURA_GRAPHQL_ADMIN_SECRET: "demo"
  SPECIAL_ENV_VARIABLE: "Demo content of the special env variable"
envForce: # Totally dangerous but really really useful (I really hope you are aware of what this will do)
  HASURA_GRAPHQL_API_ENDPOINT: "http://graphql-engine:8081/v1/graphql"
  HASURA_GRAPHQL_ADMIN_SECRET: "IWillForceThisValue"
`;

export const hlambdaREADMETemplate = `# Hlambda

This is your folder containing all the metadata needed for the app to run in Hlambda server.

Please read more about on https://hlambda.io

`;
