import {ArgumentParser} from 'argparse';
import fs from 'fs';

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
    description: 'Pact Dev Server'
  });

   parser.addArgument(
    [ '-n', '--new' ],
    {
      help: 'Create a new Interaction File'
    }
  );

  parser.addArgument(
    [ '-f', '--file' ],
    {
      help: 'Start server with Serverfile (default: ./servers.json)',
      defaultValue: './servers.json'
    }
  );

  parser.addArgument(
    [ '-p', '--glob-pattern' ],
    {
      help: 'Set the glob pattern for pact files (default: **/*.interaction.json',
      defaultValue: '**/*.interaction.json'
    }
  );

  parser.addArgument(
    [ '-d', '--contract-dir' ],
    {
      help: 'Set the Contracts directory (default: ./pacts)',
      defaultValue: './pacts'
    }
  );

  parser.addArgument(
    [ '-l', '--log-path' ],
    {
      help: 'Set the logpath (default: ./pact-dev-server.log)',
      defaultValue: './pact-dev-server.log'
    }
  );

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
