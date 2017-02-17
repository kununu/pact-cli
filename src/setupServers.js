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
              require(`${process.cwd()}/${file}`)(Pact.Matchers), // eslint-disable-line global-require, import/no-dynamic-require
            );
            break;

          case '.json':
            interactions.push(
              readJSON(file),
            );
            break;

          default:
            break;
        }
      });
      resolve(interactions);
    });
  });
}

export default function setupServers (args, servers, interactions) {
  log('Startup Servers ...');

  servers.forEach((specs) => {
    const filteredInteractions = interactions.filter((interaction) =>
      specs.consumer === interaction.consumer &&
      specs.provider === interaction.provider,
    );

    if (filteredInteractions.length > 0) {
      const mockserver = wrapper.createServer({
        port: specs.port,
        log: args.log_path,
        dir: args.contract_dir,
        spec: specs.spec,
        consumer: specs.consumer,
        provider: specs.provider,
      });

      mockserver.start().then(() => {
        log(`Server for ${specs.provider} -> ${specs.consumer} started on port:${specs.port}`);

        filteredInteractions.forEach((interaction) => {
          const pactProvider = Pact({
            consumer: interaction.consumer,
            provider: interaction.provider,
            port: specs.port,
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
