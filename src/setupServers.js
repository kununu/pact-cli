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

    const interaction = interactions.find(interaction => {
      return specs.consumer == interaction.consumer &&
        specs.provider == interaction.provider;
    });

    mockserver.start().then(() => {
      log(`Server for ${interaction.provider} -> ${interaction.consumer} started on port:${specs.port}`);
      const consumer = interaction.consumer;
      const provider = interaction.provider;
      const port = specs.port;

      const pactProvider = Pact({consumer, provider, port});
      log(`Add Interaction "${interaction.interaction.state}" for ${provider} -> ${consumer}`);
      pactProvider.addInteraction(interaction.interaction);
    });
  });
}
