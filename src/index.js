#! /usr/bin/env node
// ################################################################################
// Author: Gordan Nekić <gordan@neki.ch>
// Date: 2022-02-05
// ################################################################################
// Main file, entry point for the CLI.

import { Command } from 'commander';
import { readFile } from 'fs/promises';
import 'colors';

// Load the sub-commands
import { init } from './commands/init.js';
import { startConsole } from './commands/console.js';
import { serverReload, serverClearMetadata, metadataApply, metadataExport } from './commands/metadata.js';

// Import package.json because we need to detect version from single source of truth.
// import * as pckg from './../package.json'; // As of 2020 --experimental-json-modules flag is needed
const pckg = JSON.parse(await readFile(new URL('./../package.json', import.meta.url)));

// Init CLI program
const program = new Command();

// Define commander CLI program
program
  .name('hlambda')
  .description(`CLI for hlambda server. | v${pckg.version}`)
  // .allowUnknownOption()
  // .enablePositionalOptions()
  // .passThroughOptions()
  .version(`${pckg.version}`, '-v, --version', 'output the current version.');
// This line is bugged in commander 9.0.0, --version does not work but -version works and -vers works, super strange.
// If persist in multiple versions open the issue on https://github.com/tj/commander.js
// .version(pckg.version, '-V, -v, --vers, --version', 'output the current version.');
const versionProgram = program
  .command('version')
  .description('output the current version.')
  .action(() => {
    console.log(`${pckg.version}`);
  });

// Initialization sub-program
const initProgram = program
  .command('init')
  .argument('<folder_name>', 'folder name')
  .option('-c, --clean', "don't include demo app in initial metadata")
  .description('Init configuration and metadata for the hlambda server.')
  .action(init);

// Console sub-program
const consoleProgram = program
  .command('console')
  .description('Opens browser to the hlambda console')
  .option('-c, --config <string>', 'path to config.yaml', '')
  // .argument('<string>', 'admin secret')
  .action(startConsole);

// Metadata sub-program
const metadata = program.command('metadata').description('Import/Export metadata');

metadata
  .command('reload')
  .description('Reload existing metadata on the server')
  .option('-c, --config <string>', 'path to config.yaml', '')
  .option('-s, --admin-secret <string>', 'admin secret used for auth.')
  .action(serverReload);

metadata
  .command('clear')
  .description('Clear existing metadata on the server')
  .option('-c, --config <string>', 'path to config.yaml', '')
  .option('-s, --admin-secret <string>', 'admin secret used for auth.')
  .action(serverClearMetadata);

metadata
  .command('apply')
  .description('Apply metadata')
  .option('-c, --config <string>', 'path to config.yaml', '')
  .option('-s, --admin-secret <string>', 'admin secret used for auth.')
  .option('--no-auto-reload', 'should metadata apply skip auto reload')
  .action(metadataApply);

metadata
  .command('export')
  .description('Export metadata')
  .option('-c, --config <string>', 'path to config.yaml', '')
  .option('-s, --admin-secret <string>', 'admin secret used for auth.')
  .action(metadataExport);

// Parsing args
program.parse(process.argv);

const options = program.opts();

// console.log('Options: ', options);
// console.log('Remaining arguments: ', program.args);

// Start processing the command...
