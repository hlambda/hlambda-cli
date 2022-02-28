import path from 'path';
import inquirer from 'inquirer';

import { errors } from './../../errors/index.js';

import CLIErrorHandler from './../../utils/CLIErrorHandler.js';
import { loadConfigFromYAML } from './../../utils/loadConfigFromYAML.js';

import { dockerInstallSnippet } from './install-snippets.js';

export const questionnaire = async (options, program) => {
  await (async () => {
    const cwd = path.resolve(process.cwd());
    console.log('Executing in cwd:'.green, `${cwd}`.yellow);

    const questions = [
      {
        type: 'list',
        name: 'type',
        message: 'What type of Hlambda server do you need?',
        choices: ['Stand-Alone', 'Hasura'],
        filter(val) {
          return val.toLowerCase();
        },
      },
      {
        type: 'input',
        name: 'port',
        message: 'On which port do you want to run hlambda server?',
        default: '8081',
      },
      {
        type: 'input',
        name: 'adminSecret',
        message: 'Admin secret for your Hlambda server?',
        default: 'demo',
      },
      {
        type: 'input',
        name: 'hlambdaVolume',
        message: 'Hlambda server volume name',
        default: 'hlambda_metadata',
      },
    ];

    const answers = await inquirer
      .prompt(questions)
      .then((_answers) => {
        return _answers;
      })
      .catch((error) => {
        console.error(error);
        throw new Error(errors.FUNCTIONALITY_NOT_IMPLEMENTED);
      });

    // console.log(JSON.stringify(answers, null, '  '));
    if (answers?.type === 'stand-alone') {
      console.log(
        `To run Hlambda in docker as stand-alone server instance you can run:


  docker run -d -p ${answers?.port}:1331 --env HLAMBDA_ADMIN_SECRET=${answers?.adminSecret} --name hlambda-server --restart=always -v ${answers?.hlambdaVolume}:/usr/src/app/metadata hlambda/hlambda-core:latest


This will:
- Run new container named: hlambda-server
- Run latest hlambda server on host port: ${answers?.port}
- Set hlambda server admin secret to: ${answers?.adminSecret}
- Create volume for your metadata named: ${answers?.hlambdaVolume}
`.yellow
      );
    }

    if (answers?.type === 'hasura') {
      console.log(
        `
To run Hlambda in docker stack with Postgres and Hasura(https://hasura.io) you can run:


version: '3.6'
services:
  postgres:
    image: postgres:12
    restart: always
    volumes:
      - hasura_db_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: postgrespassword
  graphql-engine:
    image: hasura/graphql-engine:v2.3.0-beta.1
    ports:
      - "8080:8080"
    depends_on:
      - "postgres"
    restart: always
    environment:
      HASURA_GRAPHQL_METADATA_DATABASE_URL: "postgres://postgres:postgrespassword@postgres:5432/postgres"
      HASURA_GRAPHQL_ADMIN_SECRET: "demo"
      HASURA_GRAPHQL_ENABLE_TELEMETRY: "false"
      HASURA_GRAPHQL_ENABLE_CONSOLE: "true"
      HASURA_GRAPHQL_DEV_MODE: "true"
      HASURA_GRAPHQL_ENABLED_LOG_TYPES: "startup, http-log, webhook-log, websocket-log, query-log"
      HASURA_GRAPHQL_JWT_SECRET: '{"claims_namespace_path":"$$", "type":"RS256", "key": "-----BEGIN PUBLIC KEY-----\\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxITajyliCtRFJ9SLPbGs\\n8+uL/FZok7big7zQ6lQUJ/3s+MndrLoAhbBZuaf1RKhzWRkizV7I3BetbZ86Iyir\\nt0Fp7Lu0Rtyq5GH1O9vAYh5wdp1bQ1t45v/ifR4/Y7C97qq1e1IoelpJxlkEUAN2\\nELBMYJ1SGIl94BKgDoF835H68X/s+bKJHoFYPyGPeJbdNFAmYGgrZMleid+bT3Qr\\neijMoMuIj1XVMSlN405QWeNqFMGVB73gjhsc3pmyePUBbi67Va+pEBsbexYVsvqO\\nynQYlSExbJfHcNL+f0sYrXsGmsPnFji2JWsE3LEUb6Xgab+zmZb+0NcXzMu+t7Hr\\ndwIDAQAB\\n-----END PUBLIC KEY-----\\n"}'
      ACTION_BASE_URL: "http://hlambda-core:1331"
  hlambda-core:
    image: hlambda/hlambda-core:latest
    environment:
      HLAMBDA_ADMIN_SECRET: '${answers?.adminSecret}'
      HASURA_GRAPHQL_API_URL: "http://graphql-engine:8080"
      HASURA_GRAPHQL_ADMIN_SECRET: "demo"
    ports:
      - "${answers?.port}:1331"
    restart: always
    volumes:
      - ${answers?.hlambdaVolume}:/usr/src/app/metadata

volumes:
  hasura_db_data:
  ${answers?.hlambdaVolume}:


This will:
- Run Hlambbda & Hasura stack
`.yellow
      );
    }
  })()
    .then(() => {})
    .catch(CLIErrorHandler(program));
};

export default questionnaire;
