import {ArgumentParser} from 'argparse';
import fs from 'fs';

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
    description: 'Pact Dev Server'
  });

  parser.addArgument(
    ['-x', '--publish'],
    {
      help: 'Publish a file to a broker (Configurationfile required)'
    }
  );

  parser.addArgument(
    [ '-n', '--new' ],
    {
      help: 'Interaction file generator',
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
    [ '-g', '--glob-pattern' ],
    {
      help: 'Set the glob pattern for pact files (default: **/*.interaction.json',
      defaultValue: '**/*.interaction.json'
    }
  );

  parser.addArgument(
    [ '-d', '--contract-dir' ],
    {
      help: 'Set the Contracts directory (default: ./pacts)',
      defaultValue: './pacts',
    }
  );

  parser.addArgument(
    [ '-l', '--log-path' ],
    {
      help: 'Set the logpath (default: ./pact-dev-server.log)',
      defaultValue: './pact-dev-server.log',
    }
  );

  parser.addArgument(
    ['-y', '--broker-config' ],
    {
      help: 'Broker Config generator (saved in ~/.pact-dev-server)',
      action: 'storeConst',
      constant: 42
    }
  );

  const args = parser.parseArgs();
  args.log_path = path.resolve(process.cwd(), args.log_path);
  return args;
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
