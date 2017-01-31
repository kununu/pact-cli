import {ArgumentParser} from 'argparse';
import fs from 'fs';

export function die(msg, code=1) {
  process.stdout.write(`${msg}\n`);
  process.exit(code);
}

export function parseArgs() {
  var parser = new ArgumentParser({
    version: '0.0.1',
    addHelp:true,
    description: 'Pact Dev Server'
  });

  parser.addArgument(
    [ '-t', '--test' ],
    {
      help: 'testing'
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
