import path from 'path';

import Pact from 'pact';
import glob from 'glob';

import {log, readJSON} from './helpers';


export function getInteractionsPromise () {
  return new Promise((resolve, reject) => {
    log('Searching for interaction files ...');

    const interactions = [];
    glob('**/*.+(interaction|interactions).+(json|js)', {ignore: 'node_modules/'}, (err, files) => {
      if (err) {
        reject(err);
      }

      files.forEach((file) => {
        // Check if file contains an array of interactions
        if (path.basename(file).includes('interactions')) {
          const fileInteractions = require(`${process.cwd()}/${file}`)(Pact.Matchers); // eslint-disable-line global-require, import/no-dynamic-require

          // Add all interactions and return
          return fileInteractions.forEach((interaction) => interactions.push(interaction));
        }

        // Single interaction files
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

function addInteractionsToProvider (provider, interactions, port) {
  interactions.map((interaction) => {
    const url = `(${interaction.interaction.withRequest.method}) http://localhost:${port}${interaction.interaction.withRequest.path}`;
    log(`Add Interaction "${interaction.interaction.state}" on ${url}`);
    return provider.addInteraction(interaction.interaction);
  });
}

export default function setupServers (args, servers, interactions) {
  if (args.daemon) {
    log('Start Daemon');
    require('daemon')(); // eslint-disable-line
  }

  log('Startup Servers ...');

  servers.forEach((specs) => {
    const {consumer, provider, port, ssl} = specs;
    const filteredInteractions = interactions.filter((interaction) => consumer === interaction.consumer &&
        provider === interaction.provider);

    if (filteredInteractions.length <= 0) {
      return log(`No Interactions for ${provider} -> ${consumer} found - not creating server`);
    }

    const pactProvider = Pact({
      consumer,
      provider,
      logLevel: 'ERROR',
      port,
      ssl,
    });

    return pactProvider.setup()
      .then(() => {
        log(`Server for ${provider} -> ${consumer} started on port:${port}`);
        addInteractionsToProvider(pactProvider, filteredInteractions, port);
      });
  });
}
