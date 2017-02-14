import {ArgumentParser} from 'argparse';
import fs from 'fs';
import path from 'path';

export function getConfig() {
  const HOME = process.env.HOME || process.env.USERPROFILE;
  const CONFIGFILE = `${HOME}/.pact-cli`;
  
  if (!fs.existsSync(CONFIGFILE))
    die(`You have no Configfile yet (pact-cli config)`)

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

  const DEFAULT_SERVERFILE = './servers.json';

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
  const cmdVerify = subparsers.addParser('verify', {addHelp:true});

  cmdServer.addArgument(['CHOICE'], {
    action: 'store',
    help: '',
    choices: ['start', 'add']
  });

  cmdServer.addArgument(['-f', '--file'], {
    action: 'store',
    help: 'Path to your Serverfile',
    metavar: 'SERVERFILE',
    defaultValue: DEFAULT_SERVERFILE
  });

  cmdServer.addArgument(['-l', '--log-path'], {
    action: 'store',
    help: 'Logpath (default: ./pact-cli-server.log)',
    metavar: 'LOGFILE',
    defaultValue: path.resolve(process.cwd(), './pact-cli-server.log')
  });

  cmdServer.addArgument(['-d', '--contract-dir'], {
    action: 'store',
    help: 'Contracts directory (default: ./tmp/pacts)',
    metavar: 'DIRECTORY',
    defaultValue: './tmp/pacts'
  });

  cmdNew.addArgument(['INTERACTIONNAME'], {
    action: 'store',
    help: 'Interaction Name'
  });

  cmdNew.addArgument(['-f', '--file'], {
    action: 'store',
    help: 'Path to your Serverfile',
    metavar: 'SERVERFILE',
    defaultValue: DEFAULT_SERVERFILE
  });

  cmdPublish.addArgument(['-v', '--version'], {
    action: 'store',
    help: 'Version Number (required)',
    required: true
  });

  cmdPublish.addArgument(['-t', '--tags'], {
    action: 'store',
    help: 'Comma seperated Taglist'
  });

  cmdPublish.addArgument(['PACT_FILE'], {
    action: 'store',
    help: 'Pact File to publish'
  });

  cmdVerify.addArgument(['PACT_FILE'], {
    action: 'store',
    help: 'Pact File to verify'
  });

  cmdVerify.addArgument(['-u', '--states-url'], {
    action: 'store',
    help: 'States Url'
  });

  cmdVerify.addArgument(['-s', '--setup-url'], {
    action: 'store',
    help: 'Setup Url'
  });

  cmdVerify.addArgument(['-p', '--provider-url'], {
    action: 'store',
    help: 'Provider Base Url'
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
