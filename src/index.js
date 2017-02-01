#! /usr/bin/env node

import path from 'path';
import {die, getParsedArgs, readJSON} from './helpers';
import setupServers, {getInteractionsPromise} from './setupServers';
import {interactionWizard} from './wizards';
import glob from 'glob';

const pkg = readJSON(path.resolve(__dirname, '../package.json'));
const args = getParsedArgs(pkg.version);
const servers = readJSON(args.file);

if (args.new) {
  interactionWizard(args.new);
} else {
  getInteractionsPromise(args).then((interactions) => {
    setupServers(args, servers, interactions);
  }, (err) =>  { console.log(err) });
}

