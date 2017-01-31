import Pact from 'pact';
import wrapper from '@pact-foundation/pact-node';
import glob from 'glob';
import {log, readJSON} from './helpers';

export function getInteractionsPromise(args) {
  return new Promise((resolve, reject) => {
    const interactions = [];
    glob(args.glob_pattern, {ignore: 'node_modules/'}, (err, files) => {
      if (err) {
        reject(err);
      }

      files.forEach(file => {
        interactions.push(readJSON(file));
      });

      resolve(interactions);
    });
  });
}

export default function setupServers(args, servers, interactions) {
  let mockservers = [];

  servers.forEach(specs => {
    const mockserver = wrapper.createServer({
      port: specs.port,
      log: args.log_path,
      dir: args.contract_dir,
      spec: specs.spec,
      consumer: specs.consumer,
      provider: specs.provider
    });

    mockserver.__devserverId = `${specs.consumer}:${specs.provider}`;
    mockservers.push(mockserver);

    mockserver.start().then(() => {
      console.log(st,st2,st3);
      log(`Server ${mockserver.__devserverId} started`);
    });
  });
  // get resolved too fast ?
  Promise.all(mockservers).then((resolvedServers) => {
    resolvedServers.forEach(startedServer => {
      interactions.forEach(interaction => {
        if (startedServer._options.consumer == interaction.consumer &&
        startedServer._options.provider == interaction.provider) {
          const consumer = interaction.consumer;
          const provider = interaction.provider;
          const port = startedServer._options.port;
          const pactProvider = Pact({consumer, provider, port});
          log(`Add Interaction for ${consumer} ${provider} ${port}`);
          pactProvider.addInteraction(interaction.interaction);
        }
      });
    });
  });
}
