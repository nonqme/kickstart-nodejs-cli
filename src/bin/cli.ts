#!/usr/bin/env node

import sade from 'sade';

import init from '../commands/init.js';

const program = sade('kickstart');

program
  .version('0.0.1')
  .describe('A CLI tool for kickstarting node.js projects');

program
  .command('init <project-name>')
  .example('kickstart init my-project')
  .action((projectName: string) => {
    init(projectName);
  });

program.parse(process.argv);
