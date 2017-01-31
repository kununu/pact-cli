import {ArgumentParser} from 'argparse';
import fs from 'fs';

export function die(msg, code=1) {
  process.stdout.write(`${msg}\n`);
  process.exit(code);
}

export function getParsedArgs(version) {
  var parser = new ArgumentParser({
    version: version,
    addHelp:true,
    description: 'Pact Dev Server'
  });

  parser.addArgument(
    [ '-f', '--file' ],
    {
      help: 'Start server with Serverfile (default: ./servers.json)',
      defaultValue: './servers.json'
    }
  );

  parser.addArgument(
    [ '-p', '--glob' ],
    {
      help: 'Set the glob pattern for pact files (default: **/*.interaction.js',
      defaultValue: '**/*.interaction.js'
    }
  );

  parser.addArgument(
    [ '-d', '--contractdir' ],
    {
      help: 'Set the Contracts directory (default: ./pacts)',
      defaultValue: './pacts'
    }
  );

  parser.addArgument(
    [ '-l', '--logpath' ],
    {
      help: 'Set the logpath (default: ./pact-dev-server.log)',
      defaultValue: './pact-dev-server.log'
    }
  );

  return parser.parseArgs();
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
