export const configTemplate = `version: 1
endpoint: http://localhost:8081
metadata_directory: metadata
#admin_secret: demo
`;

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
envForce:
  HASURA_GRAPHQL_API_ENDPOINT: "http://graphql-engine:8081/v1/graphql"
  HASURA_GRAPHQL_ADMIN_SECRET: "demo"
`;
