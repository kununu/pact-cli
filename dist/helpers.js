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

function getParsedArgs(version) {
  var parser = new _argparse.ArgumentParser({
    version: version,
    addHelp: true,
    description: 'Pact Dev Server'
  });

  parser.addArgument(['--publish'], {
    help: 'Publish a file to a broker (Configurationfile required)',
    metavar: 'PACT_FILE_PATH'
  });

  parser.addArgument(['-n', '--new'], {
    help: 'Interaction file generator',
    metavar: '[NAME].interaction.json'
  });

  parser.addArgument(['-f', '--file'], {
    help: 'Start server with Serverfile (default: ./servers.json)',
    defaultValue: './servers.json',
    metavar: 'FILENAME'
  });

  parser.addArgument(['-g', '--glob-pattern'], {
    help: 'Set the glob pattern for pact files (default: **/*.interaction.json',
    defaultValue: '**/*.interaction.json'
  });

  parser.addArgument(['-d', '--contract-dir'], {
    help: 'Set the Contracts directory (default: ./pacts)',
    defaultValue: './pacts',
    metavar: 'DIRNAME'
  });

  parser.addArgument(['-l', '--log-path'], {
    help: 'Set the logpath (default: ./pact-dev-server.log)',
    defaultValue: './pact-dev-server.log',
    metavar: 'LOGPATH'
  });

  parser.addArgument(['--broker-config'], {
    help: 'Broker Config generator (saved in ~/.pact-dev-server)',
    action: 'storeConst',
    constant: 42
  });

  var args = parser.parseArgs();
  args.log_path = path.resolve(process.cwd(), args.log_path);
  return args;
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