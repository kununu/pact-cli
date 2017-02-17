#! /usr/bin/env node

import path from 'path';

import {getParsedArgs, readJSON} from './helpers';
import setupServers, {getInteractionsPromise} from './setupServers';
import {serverWizard, interactionWizard, brokerConfigWizard} from './wizards';
import {publish, verify} from './commands';

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
    publish(args);
    break;

  case 'verify':
    verify(args);
    break;

  default:
    break;
}
