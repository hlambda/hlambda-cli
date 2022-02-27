#! /usr/bin/env node
// ################################################################################
// Author: Gordan Nekić <gordan@neki.ch>
// Date: 2022-02-05
// ################################################################################
// Main file, entry point for the CLI.
import { Command } from 'commander';
import { readFileSync } from 'fs';
// import { readFile } from 'fs/promises';
import 'colors';
import figlet from 'figlet';

// Load the sub-commands
import { init } from './commands/init.js';
import { config } from './commands/config.js';
import { save } from './commands/save.js';
import { requests } from './commands/requests.js';
import { startConsole } from './commands/console.js';
import { serverReload, serverClearMetadata, metadataApply, metadataExport } from './commands/metadata.js';
import { checkForNewVersion, checkWhatIsNewInCurrentVersion } from './commands/update.js';
import {
  serverGetLogs,
  serverGetErrors,
  serverGetConstants,
  serverShell,
  serverNPMInstall,
} from './commands/server.js';
import addEnv from './commands/environment/add.js';
import deleteEnv from './commands/environment/delete.js';

// Import package.json because we need to detect version from single source of truth.
// import * as pckg from './../package.json'; // As of 2020 --experimental-json-modules flag is needed
// const pckg = await readFile(new URL('./../package.json', import.meta.url)); // <-- This is the best option but eslint hates await outside async func. ... stage 4
let pckg;
try {
  const packageJsonRawData = readFileSync(new URL('./../package.json', import.meta.url));
  pckg = JSON.parse(packageJsonRawData);
} catch (error) {
  console.log(error);
  process.exit(1);
}

// Do some ascii art... because we can
const asciiArt = figlet.textSync('Hlambda', {
  font: 'Ghost',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 80,
  whitespaceBreak: true,
});

// Init CLI program
const program = new Command();

// Define commander CLI program
program
  .name('hlambda')
  .description(
    `${Array(80 + 1).join('#')}\n${asciiArt}\n${Array(80 + 1).join('#')}\nCLI for hlambda server. | v${
      pckg.version
    } | Node.js v${process.versions.node}\n${Array(80 + 1).join('#')}`
  )
  // .allowUnknownOption()
  .enablePositionalOptions()
  .passThroughOptions()
  .option('--no-color', 'Disable CLI color output.')
  .version(`${pckg.version}`, '-v, --version', 'Output the current version.');
// This line is bugged in commander 9.0.0, --version does not work but -version works and -vers works, super strange.
// If persist in multiple versions open the issue on https://github.com/tj/commander.js
// .version(pckg.version, '-V, -v, --vers, --version', 'Output the current version.');
const versionProgram = program
  .command('version')
  .alias('v')
  .description('Output the current version.')
  .action(() => {
    console.log(`${pckg.version}`);
  });

// --- Snippet Program ---
// Idea is to have quick snippets in CLI
const snippetProgram = program
  .command('snippets')
  .alias('snip')
  .description('Output default or create new snippets.')

// --- Env Program ---
const environmentsProgram = program
  .command('envrionments')
  .alias('env')
  .description('Configure environments.')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')

const envAddProgram = environmentsProgram
  .command('add')
  .alias('a')
  .description('Adds new environment.')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .action(addEnv);

const envDeleteProgram = environmentsProgram
  .command('delete')
  .alias('d')
  .description('Deletes new environment.')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .action(deleteEnv);

// --- Update Program ---
const checkForNewVersionProgram = program
  .command('update')
  .alias('u')
  .description('Check if there is a new cli version.')
  .action(checkForNewVersion);

const changeLogProgram = program
  .command('news')
  .alias('n')
  .description('Output the change log. And any announcement from hlambda team.')
  .action(checkWhatIsNewInCurrentVersion);

// Initialization sub-program
const initProgram = program
  .command('init')
  .alias('i')
  .description('Init configuration and metadata for the hlambda server.')
  .argument('<folder_name>', 'Folder name.')
  .option('-c, --clean', "Don't include demo app in initial metadata.")
  .option('-f, --force', 'Force re-init, it will write over the existing files.')
  .option('-f, --force-remove', 'Clean up all the files from the directory. (!!!SUPER DANGEROUS!!!)')
  .action(init);

// Save/Configure sub-program
const configProgram = program
  .command('config')
  .alias('c')
  .alias('conf')
  .description('Read or update configuration in the local config.yaml file.')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .action(config);

const saveProgram = configProgram
  .command('save')
  .alias('s')
  .description('Update configuration in the local config.yaml.')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-e, --endpoint <endpoint>', 'Endpoint, url for hlambda server.')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .action(save);

const readProgram = configProgram
  .command('read')
  .alias('r')
  .description('Update configuration in the local config.yaml.')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .action(config);

// Console sub-program
const consoleProgram = program
  .command('console')
  .alias('o')
  .description('Opens browser to the hlambda console')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  // .argument('<string>', 'admin secret')
  .action(startConsole);

// Metadata sub-program
const metadata = program
  .command('metadata')
  .alias('meta')
  .alias('m')
  .description('Apply/Export/Clear/Reload metadata, your code and configurations');

metadata
  .command('reload')
  .alias('r')
  .description('Reload existing metadata on the server')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .action(serverReload);

metadata
  .command('clear')
  .alias('c')
  .description('Clear existing metadata on the server')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .option('--no-auto-reload', 'should metadata apply skip auto reload')
  .action(serverClearMetadata);

metadata
  .command('apply')
  .alias('a')
  .description('Apply metadata')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .option('--no-auto-reload', 'should metadata apply skip auto reload')
  .action(metadataApply);

metadata
  .command('export')
  .alias('e')
  .description('Export metadata')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .action(metadataExport);

const serverProgram = program.command('server').alias('s').description('Do basic server request.');

serverProgram
  .command('logs')
  .alias('l')
  .description('Show server logs')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .action(serverGetLogs);

serverProgram
  .command('errors')
  .alias('e')
  .description('Show server errors')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .action(serverGetErrors);

serverProgram
  .command('constants')
  .alias('c')
  .description('Show server constants')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .action(serverGetConstants);

serverProgram
  .command('shell')
  .alias('s')
  .description('Show server constants')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .action(serverShell);

const npmServerProgram = serverProgram
  .command('npm')
  .description('Run npm commands.')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.');

npmServerProgram
  .command('install')
  .alias('i')
  .description('Run npm install. (Installing metadata dependency on the server)')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .action(serverNPMInstall);

// We already have node-fetch why should we use curl :) ?
const curlProgram = program.command('request').alias('r').description('Do basic requests.');

const getCurlProgram = curlProgram
  .command('get')
  .alias('g')
  .description('Makes GET request to the endpoint.')
  .argument('<route_path>', 'route_path')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .option('--dry-run', 'Just write corresponding CURL command without actually triggering the request.')
  .action(requests('GET'));

const postCurlProgram = curlProgram
  .command('post')
  .alias('p')
  .description('Makes POST request to the endpoint.')
  .argument('<route_path>', 'route_path')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .option('--dry-run', 'Just write corresponding CURL command without actually triggering the request.')
  .action(requests('POST'));

const putCurlProgram = curlProgram
  .command('put')
  .description('Makes PUT request to the endpoint.')
  .argument('<route_path>', 'route_path')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .option('--dry-run', 'Just write corresponding CURL command without actually triggering the request.')
  .action(requests('PUT'));

const deleteCurlProgram = curlProgram
  .command('delete')
  .description('Makes DELETE request to the endpoint.')
  .argument('<route_path>', 'route_path')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .option('--dry-run', 'Just write corresponding CURL command without actually triggering the request.')
  .action(requests('DELETE'));

const optionsCurlProgram = curlProgram
  .command('options')
  .description('Makes OPTIONS request to the endpoint.')
  .argument('<route_path>', 'route_path')
  .option('-c, --config <path>', 'Path to config.yaml file.', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .option('--dry-run', 'Just write corresponding CURL command without actually triggering the request.')
  .action(requests('OPTIONS'));

// Parsing args
program.parse(process.argv);

const options = program.opts();

// console.log('Options: ', options);
// console.log('Remaining arguments: ', program.args);

// Start processing the command...
