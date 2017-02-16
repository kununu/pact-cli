#! /usr/bin/env node

import path from 'path';

import {getParsedArgs, readJSON} from './helpers';
import setupServers, {getInteractionsPromise} from './setupServers';
import {serverWizard, interactionWizard, brokerPublishWizard, brokerConfigWizard} from './wizards';

const pkg = readJSON(path.resolve(__dirname, '../package.json'));
const args = getParsedArgs(pkg.version);

switch (args.subcommand_name) {
  case 'server':
    if (args.CHOICE === 'start') {
      const servers = readJSON(args.file);
      getInteractionsPromise().then((interactions) => {
        setupServers(args, servers, interactions);
      }, (err) => { console.log(err); }); // eslint-disable-line no-console
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
    brokerPublishWizard(args.PACT_FILE);
    break;

  default:
    break;
}
