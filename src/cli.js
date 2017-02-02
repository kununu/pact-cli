#! /usr/bin/env node

import path from 'path';
import {die, getParsedArgs, readJSON} from './helpers';
import setupServers, {getInteractionsPromise} from './setupServers';
import {brokerPublishWizard, interactionWizard, brokerconfigWizard} from './wizards';
import glob from 'glob';

const pkg = readJSON(path.resolve(__dirname, '../package.json'));
const args = getParsedArgs(pkg.version);

if (args.new) {
  interactionWizard(args.new);
} else if (args.broker_config) {
  brokerconfigWizard();
} else if (args.publish) {
  brokerPublishWizard(args.publish);
} else {
  const servers = readJSON(args.file);
  getInteractionsPromise(args).then((interactions) => {
    setupServers(args, servers, interactions);
  }, (err) =>  { console.log(err) });
}

