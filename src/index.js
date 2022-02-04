#! /usr/bin/env node
import { Command } from 'commander';
const program = new Command();

import 'colors';

import { metadataApply, metadataExport } from './commands/metadata.js';

// Define commander CLI program
program
  .name('hlambda')
  .description('CLI to use hlambda server functions.')
  .version('0.0.1', '-V, -v, --vers, --version,', 'output the current version.');

// program
//   .requiredOption('-i, --input <path>', 'specify the path')

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


program.parse(process.argv);

const options = program.opts();

// console.log('Options: ', options);
// console.log('Remaining arguments: ', program.args);

// Start processing the command...
