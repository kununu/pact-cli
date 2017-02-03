#!/usr/bin/env node

import {ArgumentParser} from 'argparse';
import path from 'path';

var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Argparse examples: sub-commands',
});
 
var subparsers = parser.addSubparsers({
  title:'subcommands',
  dest:"subcommand_name"
});

const cmdServer = subparsers.addParser('server', {addHelp:true});

cmdServer.addArgument(['-f', '--file'], {
  action: 'store',
  help: 'Server with File',
  metavar: 'SERVERFILE',
  defaultValue: './servers.json'
});

cmdServer.addArgument(['-g', '--glob'], {
  action: 'store',
  help: 'Set the glob pattern for pact files (default: **/*.interaction.json',
  defaultValue: '**/*.interaction.json'
});

cmdServer.addArgument(['-l', '--log-path'], {
  action: 'store',
  help: 'Set the logpath (default: ./pact-dev-server.log)',
  metavar: 'LOGFILE',
  defaultValue: path.resolve(process.cwd(), './server.json')
});

cmdServer.addArgument(['-d', '--contract-dir'], {
  action: 'store',
  help: 'Set the Contracts directory (default: ./pacts)',
  metavar: 'DIRECTORY',
  defaultValue: './pacts'
});

const cmdNew = subparsers.addParser('new', {addHelp:true});

cmdNew.addArgument(['CHOICE'], {
  action: 'store',
  help: 'Server with File',
  choices: ['interaction', 'server']
});

const cmdConfig = subparsers.addParser('config', {addHelp:true});

const cmdPublish = subparsers.addParser('publish', {addHelp:true});

cmdPublish.addArgument(['PACT_FILE'], {
  action: 'store',
  help: 'Pactfile'
});

var args = parser.parseArgs();
console.dir(args);
 
