import path from 'path';

import Pact from 'pact';
import glob from 'glob';

import wrapper from '@pact-foundation/pact-node';

import {log, readJSON} from './helpers';

export function getInteractionsPromise () {
  return new Promise((resolve, reject) => {
    log('Searching for interaction files ...');

    const interactions = [];
    glob('**/*.interaction.+(json|js)', {ignore: 'node_modules/'}, (err, files) => {
      if (err) {
        reject(err);
      }

      files.forEach((file) => {
        switch (path.extname(file)) {

          case '.js':
            interactions.push(
              require(`${process.cwd()}/${file}`)(Pact.Matchers), // eslint-disable-line
            );
            break;

          case '.json':
            interactions.push(
              readJSON(file),
            );
            break;

          default:
            log(`non interactionfile: ${file}`);
        }
      });
      resolve(interactions);
    });
  });
}

export default function setupServers (args, servers, interactions) {
  if (args.daemon) {
    log('Start Daemon');
    require('daemon')(); // eslint-disable-line
  }

  log('Startup Servers ...');

  servers.forEach((specs) => {
    const filteredInteractions = interactions.filter((interaction) => specs.consumer === interaction.consumer &&
        specs.provider === interaction.provider);

    let sslkey = false;
    let sslcert = false;

    if (specs.sslcert && specs.sslkey) {
      sslkey = path.resolve(process.cwd(), specs.sslkey);
      sslcert = path.resolve(process.cwd(), specs.sslcert);
    }

    if (filteredInteractions.length > 0) {
      const mockserver = wrapper.createServer({
        port: specs.port,
        log: args.log_path,
        dir: args.contract_dir,
        spec: specs.spec,
        ssl: specs.ssl,
        sslcert,
        sslkey,
        consumer: specs.consumer,
        provider: specs.provider,
        host: specs.host,
      });

      mockserver.start().then(() => {
        log(`Server for ${specs.provider} -> ${specs.consumer} started on port:${specs.port}`);

        filteredInteractions.forEach((interaction) => {
          const pactProvider = Pact({
            consumer: interaction.consumer,
            provider: interaction.provider,
            port: specs.port,
            ssl: specs.ssl,
          });
          const url = `(${interaction.interaction.withRequest.method}) http://localhost:${specs.port}${interaction.interaction.withRequest.path}`;
          log(`Add Interaction "${interaction.interaction.state}" on ${url}`);
          pactProvider.addInteraction(interaction.interaction);
        });
      });
    } else {
      log(`No Interactions for ${specs.provider} -> ${specs.consumer} found - not creating server`);
    }
  });
}
