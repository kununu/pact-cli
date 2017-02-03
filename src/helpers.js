import {ArgumentParser} from 'argparse';
import fs from 'fs';
import path from 'path';

export function getConfig() {
  const HOME = process.env.HOME || process.env.USERPROFILE;
  const CONFIGFILE = `${HOME}/.pact-dev-server`;
  
  if (!fs.existsSync(CONFIGFILE))
    die(`You have no broker-configfile yet \ngenerate one with 'pact-dev-server --broker-config'`)

  return readJSON(CONFIGFILE);
}

export function log(msg) {
  process.stdout.write(`${msg}\n`);
}

export function die(msg, code=1) {
  process.stderr.write(`${msg}\n`);
  process.exit(code);
}

export function getParsedArgs(version) {

  var parser = new ArgumentParser({
    version: version,
    addHelp:true,
    description: 'Argparse examples: sub-commands',
  });
   
  var subparsers = parser.addSubparsers({
    title:'subcommands',
    dest:"subcommand_name"
  });

  const cmdServer = subparsers.addParser('server', {addHelp:true});
  const cmdNew = subparsers.addParser('new', {addHelp:true});
  const cmdConfig = subparsers.addParser('config', {addHelp:true});
  const cmdPublish = subparsers.addParser('publish', {addHelp:true});

  cmdServer.addArgument(['CHOICE'], {
    action: 'store',
    help: 'Server with File',
    choices: ['start', 'add']
  });

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

  cmdNew.addArgument(['FILENAME'], {
    action: 'store',
    help: 'Server with File'
  });

  cmdPublish.addArgument(['PACT_FILE'], {
    action: 'store',
    help: 'Pactfile'
  });

  return parser.parseArgs();
}

export function writeJSON(obj, path) {
  try {
    fs.writeFileSync(path, JSON.stringify(obj, null, 2));
  } catch(err) {
    die(`Error while saving JSON File: \n${err}`);
  }
}

export function readJSON(path) {
  if (!fs.existsSync(path))
    die(`File ${path} does not exist`);

  try {
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
  } catch(err) {
    die(`Malformed JSON in ${path} \n${err}`)
  }
}
