#! /usr/bin/env node

import path from 'path';
import {die, getParsedArgs, readJSON} from './helpers';
import setupServers, {getInteractionsPromise} from './setupServers';
import {serverWizard, interactionWizard, brokerConfigWizard} from './wizards';
import {publish, verify} from './commands';

const pkg = readJSON(path.resolve(__dirname, '../package.json'));
const args = getParsedArgs(pkg.version);

switch (args.subcommand_name) {
  case 'server':
    if (args.CHOICE === 'start') {
      const servers = readJSON(args.file);
      getInteractionsPromise(args).then((interactions) => {
        setupServers(args, servers, interactions);
      }, (err) => { console.log(err); });
    } else if (args.CHOICE === 'add') {
      serverWizard(args.file);
    }
    break;

  case 'new':
    interactionWizard(args);
    break;

  case 'config':
    brokerConfigWizard();
    break;

  case 'publish':
    publish(args);
    break;

  case 'verify':
    verify(args);
    break;

}
