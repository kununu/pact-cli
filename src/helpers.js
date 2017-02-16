import fs from 'fs';
import path from 'path';

import {ArgumentParser} from 'argparse';

export function die (msg, code = 1) {
  process.stderr.write(`${msg}\n`);
  process.exit(code);
}

export function readJSON (jsonPath) {
  if (!fs.existsSync(jsonPath)) { die(`File ${path} does not exist`); }

  try {
    return JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  } catch (err) {
    return die(`Malformed JSON in ${jsonPath} \n${err}`);
  }
}

export function writeJSON (obj, jsonPath) {
  try {
    fs.writeFileSync(jsonPath, JSON.stringify(obj, null, 2));
  } catch (err) {
    die(`Error while saving JSON File: \n${err}`);
  }
}

export function getConfig () {
  const HOME = process.env.HOME || process.env.USERPROFILE;
  const CONFIGFILE = `${HOME}/.pact-cli`;

  if (!fs.existsSync(CONFIGFILE)) die('You have no Configfile yet (pact-cli config)');

  return readJSON(CONFIGFILE);
}

export function log (msg) {
  process.stdout.write(`${msg}\n`);
}

export function getParsedArgs (pkgContents) {
  const DEFAULT_SERVERFILE = './servers.json';

  const parser = new ArgumentParser({
    version: pkgContents.version,
    addHelp: true,
    description: pkgContents.description,
  });

  const subparsers = parser.addSubparsers({
    title: 'subcommands',
    dest: 'subcommand_name',
  });

  const cmdServer = subparsers.addParser('server', {addHelp: true});
  const cmdNew = subparsers.addParser('new', {addHelp: true});
  const cmdPublish = subparsers.addParser('publish', {addHelp: true});

  cmdServer.addArgument(['CHOICE'], {
    action: 'store',
    help: '',
    choices: ['start', 'add'],
  });

  cmdServer.addArgument(['-f', '--file'], {
    action: 'store',
    help: 'Path to your Serverfile',
    metavar: 'SERVERFILE',
    defaultValue: DEFAULT_SERVERFILE,
  });

  cmdServer.addArgument(['-l', '--log-path'], {
    action: 'store',
    help: 'Logpath (default: ./pact-cli-server.log)',
    metavar: 'LOGFILE',
    defaultValue: path.resolve(process.cwd(), './pact-cli-server.log'),
  });

  cmdServer.addArgument(['-d', '--contract-dir'], {
    action: 'store',
    help: 'Contracts directory (default: ./tmp/pacts)',
    metavar: 'DIRECTORY',
    defaultValue: './tmp/pacts',
  });

  cmdNew.addArgument(['INTERACTIONNAME'], {
    action: 'store',
    help: 'Interaction Name',
  });

  cmdNew.addArgument(['-f', '--file'], {
    action: 'store',
    help: 'Path to your Serverfile',
    metavar: 'SERVERFILE',
    defaultValue: DEFAULT_SERVERFILE,
  });

  cmdPublish.addArgument(['PACT_FILE'], {
    action: 'store',
    help: 'Pact File to publish',
  });

  return parser.parseArgs();
}
