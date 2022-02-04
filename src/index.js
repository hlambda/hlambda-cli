#! /usr/bin/env node
import { Command } from 'commander';
import 'colors';

import { configurationInit } from './commands/configuration.js';
import { init } from './commands/init.js';
import { startConsole } from './commands/console.js';
import { metadataApply, metadataExport } from './commands/metadata.js';

// Init CLI program
const program = new Command();

// Define commander CLI program
program
  .name('hlambda')
  .description('CLI to use hlambda server functions.')
  .version('0.0.1', '-V, -v, --vers, --version,', 'output the current version.');

// Initialization sub-program
const initProgram = program
  .command('init')
  .argument('<string>', 'folder name')
  .option('-c, --clean', 'don\'t include demo app in initial metadata')
  .action(init);

// Console sub-program
const consoleProgram = program
  .command('console')
  //.argument('<string>', 'admin secret')
  .action(startConsole);

// Metadata sub-program
const metadata = program
  .command('metadata')
  .description('Import/Export metadata')

metadata
  .command('apply')
  .description('Apply metadata')
  .action(metadataApply);

metadata
  .command('export')
  .description('Export metadata')
  .action(metadataExport);

// Parsing args
program.parse(process.argv);

const options = program.opts();

// console.log('Options: ', options);
// console.log('Remaining arguments: ', program.args);

// Start processing the command...
