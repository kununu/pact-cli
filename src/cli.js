#! /usr/bin/env node

import path from 'path';
import {die, getParsedArgs, readJSON} from './helpers';
import setupServers, {getInteractionsPromise} from './setupServers';
import {serverWizard, interactionWizard, brokerPublishWizard, brokerConfigWizard} from './wizards';
import glob from 'glob';

const pkg = readJSON(path.resolve(__dirname, '../package.json'));
const args = getParsedArgs(pkg.version);

switch(args.subcommand_name) {
  case 'server':
    if (args.CHOICE === 'start') {
      const servers = readJSON(args.file);
        getInteractionsPromise(args).then((interactions) => {
        setupServers(args, servers, interactions);
      }, (err) =>  { console.log(err) }); 

    } else if (args.CHOICE === 'add') {
      serverWizard(args.file);
    }
  break;
  
  case 'new':
  console.log(args);
    interactionWizard(args.INTERACTIONNAME);
  break;

  case 'config':
    brokerConfigWizard();
  break;

  case 'publish':
    brokerPublishWizard(args.PACT_FILE);
  break;
}
