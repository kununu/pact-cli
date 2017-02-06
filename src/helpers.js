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

export function getParsedArgs(pkgContents) {

  var parser = new ArgumentParser({
    version: pkgContents.version,
    addHelp:true,
    description: pkgContents.description,
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
    help: '',
    choices: ['start', 'add']
  });

  cmdServer.addArgument(['-f', '--file'], {
    action: 'store',
    help: 'Path to your Serverfile',
    metavar: 'SERVERFILE',
    defaultValue: './servers.json'
  });

  cmdServer.addArgument(['-g', '--glob'], {
    action: 'store',
    help: 'Search glob for interaction files',
    defaultValue: '**/*.interaction.+(json|js)'
  });

  cmdServer.addArgument(['-l', '--log-path'], {
    action: 'store',
    help: 'Logpath (default: ./pact-dev-server.log)',
    metavar: 'LOGFILE',
    defaultValue: path.resolve(process.cwd(), './pact-dev-server.log')
  });

  cmdServer.addArgument(['-d', '--contract-dir'], {
    action: 'store',
    help: 'Contracts directory (default: ./pacts)',
    metavar: 'DIRECTORY',
    defaultValue: './pacts'
  });

  cmdNew.addArgument(['INTERACTIONNAME'], {
    action: 'store',
    help: 'Interaction Name'
  });

  cmdPublish.addArgument(['PACT_FILE'], {
    action: 'store',
    help: 'Pact File to publish'
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
