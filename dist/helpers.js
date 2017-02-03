'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getConfig = getConfig;
exports.log = log;
exports.die = die;
exports.getParsedArgs = getParsedArgs;
exports.writeJSON = writeJSON;
exports.readJSON = readJSON;

var _argparse = require('argparse');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getConfig() {
  var HOME = process.env.HOME || process.env.USERPROFILE;
  var CONFIGFILE = HOME + '/.pact-dev-server';

  if (!_fs2.default.existsSync(CONFIGFILE)) die('You have no broker-configfile yet \ngenerate one with \'pact-dev-server --broker-config\'');

  return readJSON(CONFIGFILE);
}

function log(msg) {
  process.stdout.write(msg + '\n');
}

function die(msg) {
  var code = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  process.stderr.write(msg + '\n');
  process.exit(code);
}

function getParsedArgs(pkgContents) {

  var parser = new _argparse.ArgumentParser({
    version: pkgContents.version,
    addHelp: true,
    description: pkgContents.description
  });

  var subparsers = parser.addSubparsers({
    title: 'subcommands',
    dest: "subcommand_name"
  });

  var cmdServer = subparsers.addParser('server', { addHelp: true });
  var cmdNew = subparsers.addParser('new', { addHelp: true });
  var cmdConfig = subparsers.addParser('config', { addHelp: true });
  var cmdPublish = subparsers.addParser('publish', { addHelp: true });

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
    help: 'Search glob for interaction files (default: **/*.interaction.json',
    defaultValue: '**/*.interaction.json'
  });

  cmdServer.addArgument(['-l', '--log-path'], {
    action: 'store',
    help: 'Logpath (default: ./pact-dev-server.log)',
    metavar: 'LOGFILE',
    defaultValue: _path2.default.resolve(process.cwd(), './server.json')
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

function writeJSON(obj, path) {
  try {
    _fs2.default.writeFileSync(path, JSON.stringify(obj, null, 2));
  } catch (err) {
    die('Error while saving JSON File: \n' + err);
  }
}

function readJSON(path) {
  if (!_fs2.default.existsSync(path)) die('File ' + path + ' does not exist');

  try {
    return JSON.parse(_fs2.default.readFileSync(path, 'utf-8'));
  } catch (err) {
    die('Malformed JSON in ' + path + ' \n' + err);
  }
}