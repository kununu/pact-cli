'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParsedArgs = getParsedArgs;
function getParsedArgs(pkgContents) {

  var DEFAULT_SERVERFILE = './servers.json';

  var parser = new ArgumentParser({
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
    defaultValue: DEFAULT_SERVERFILE
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

  cmdPublish.addArgument(['PACT_FILE'], {
    action: 'store',
    help: 'Pact File to publish'
  });

  return parser.parseArgs();
}