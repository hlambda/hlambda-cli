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
  // .enablePositionalOptions()
  // .passThroughOptions()
  .version(`${pckg.version}`, '-v, --version', 'Output the current version.');
// This line is bugged in commander 9.0.0, --version does not work but -version works and -vers works, super strange.
// If persist in multiple versions open the issue on https://github.com/tj/commander.js
// .version(pckg.version, '-V, -v, --vers, --version', 'Output the current version.');
const versionProgram = program
  .command('version')
  .description('Output the current version.')
  .action(() => {
    console.log(`${pckg.version}`);
  });

// Initialization sub-program
const initProgram = program
  .command('init')
  .description('Init configuration and metadata for the hlambda server.')
  .argument('<folder_name>', 'folder name')
  .option('-c, --clean', "don't include demo app in initial metadata.")
  .action(init);

// Save/Configure sub-program
const configProgram = program
  .command('config')
  .description('Read or update configuration in the local config.yaml.')
  .option('-c, --config <path>', 'path to config.yaml', '')
  .action(config);

const saveProgram = configProgram
  .command('save')
  .description('Update configuration in the local config.yaml.')
  .option('-c, --config <path>', 'path to config.yaml', '')
  .option('-e, --endpoint <endpoint>', 'endpoint, url for hlambda server.')
  .option('-s, --admin-secret <secret>', 'admin secret used for auth.')
  .action(save);

const readProgram = configProgram
  .command('read')
  .description('Update configuration in the local config.yaml.')
  .option('-c, --config <path>', 'path to config.yaml', '')
  .action(config);

// Console sub-program
const consoleProgram = program
  .command('console')
  .description('Opens browser to the hlambda console')
  .option('-c, --config <path>', 'path to config.yaml', '')
  // .argument('<string>', 'admin secret')
  .action(startConsole);

// Metadata sub-program
const metadata = program.command('metadata').description('Import/Export metadata');

metadata
  .command('reload')
  .description('Reload existing metadata on the server')
  .option('-c, --config <path>', 'path to config.yaml', '')
  .option('-s, --admin-secret <secret>', 'admin secret used for auth.')
  .action(serverReload);

metadata
  .command('clear')
  .description('Clear existing metadata on the server')
  .option('-c, --config <path>', 'path to config.yaml', '')
  .option('-s, --admin-secret <secret>', 'admin secret used for auth.')
  .action(serverClearMetadata);

metadata
  .command('apply')
  .description('Apply metadata')
  .option('-c, --config <path>', 'path to config.yaml', '')
  .option('-s, --admin-secret <secret>', 'admin secret used for auth.')
  .option('--no-auto-reload', 'should metadata apply skip auto reload')
  .action(metadataApply);

metadata
  .command('export')
  .description('Export metadata')
  .option('-c, --config <path>', 'path to config.yaml', '')
  .option('-s, --admin-secret <secret>', 'admin secret used for auth.')
  .action(metadataExport);

// We already have node-fetch why should we use curl :) ?
const curlProgram = program.command('request').description('Do basic requests.');

const getCurlProgram = curlProgram
  .command('get')
  .description('Makes GET request to the endpoint.')
  .argument('<route_path>', 'route_path')
  .option('-c, --config <path>', 'Path to config.yaml', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .option('--dry-run', 'Just write corresponding CURL command without actually triggering the request.')
  .action(requests('GET'));

const postCurlProgram = curlProgram
  .command('post')
  .description('Makes POST request to the endpoint.')
  .argument('<route_path>', 'route_path')
  .option('-c, --config <path>', 'Path to config.yaml', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .option('--dry-run', 'Just write corresponding CURL command without actually triggering the request.')
  .action(requests('POST'));

const putCurlProgram = curlProgram
  .command('put')
  .description('Makes PUT request to the endpoint.')
  .argument('<route_path>', 'route_path')
  .option('-c, --config <path>', 'Path to config.yaml', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .option('--dry-run', 'Just write corresponding CURL command without actually triggering the request.')
  .action(requests('PUT'));

const deleteCurlProgram = curlProgram
  .command('delete')
  .description('Makes DELETE request to the endpoint.')
  .argument('<route_path>', 'route_path')
  .option('-c, --config <path>', 'Path to config.yaml', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .option('--dry-run', 'Just write corresponding CURL command without actually triggering the request.')
  .action(requests('DELETE'));

const optionsCurlProgram = curlProgram
  .command('options')
  .description('Makes OPTIONS request to the endpoint.')
  .argument('<route_path>', 'route_path')
  .option('-c, --config <path>', 'Path to config.yaml', '')
  .option('-s, --admin-secret <secret>', 'Admin secret used for auth.')
  .option('--dry-run', 'Just write corresponding CURL command without actually triggering the request.')
  .action(requests('OPTIONS'));

// Parsing args
program.parse(process.argv);

const options = program.opts();

// console.log('Options: ', options);
// console.log('Remaining arguments: ', program.args);

// Start processing the command...
