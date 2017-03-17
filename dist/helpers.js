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
exports.bumpVersion = bumpVersion;

var _argparse = require('argparse');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var semver = require('semver');

function getConfig() {
  var HOME = process.env.HOME || process.env.USERPROFILE;
  var CONFIGFILE = HOME + '/.pact-cli';

  if (!_fs2.default.existsSync(CONFIGFILE)) die('You have no Configfile yet (pact-cli config)');

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

  var DEFAULT_SERVERFILE = './servers.json';
  var DEFAULT_DAEMON = false;

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
  var cmdVerify = subparsers.addParser('verify', { addHelp: true });

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
    defaultValue: _path2.default.resolve(process.cwd(), './pact-cli-server.log')
  });

  cmdServer.addArgument(['-c', '--contract-dir'], {
    action: 'store',
    help: 'Contracts directory (default: ./tmp/pacts)',
    metavar: 'DIRECTORY',
    defaultValue: './tmp/pacts'
  });

  cmdServer.addArgument(['-d', '--daemon'], {
    action: 'storeTrue',
    help: 'Free stdin after creating servers'
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
    help: 'Version Number'
  });

  cmdPublish.addArgument(['-t', '--tags'], {
    action: 'store',
    help: 'Comma seperated Taglist'
  });

  cmdPublish.addArgument(['-b', '--branch'], {
    action: 'store',
    help: 'branch-name will be added to tags and version bumped accordingly'
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

function bumpVersion(version, branch) {

  if (branch === 'master') {
    return semver.inc(version, 'minor');
  }

  // branch given but not master = feature-branch
  // but no prerelase
  if (branch && null === semver.prerelease(version)) {
    return semver.inc(version, 'preminor', 'rc');
  }

  if (branch) {
    return semver.inc(version, 'pre');
  }

  // default to patch increment
  return semver.inc(version, 'patch');
}