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
  servers.forEach(specs => {
    const filteredInteractions = interactions.filter(interaction => {
      return specs.consumer == interaction.consumer &&
        specs.provider == interaction.provider;
    });

    if (filteredInteractions.length > 0) {
      const mockserver = wrapper.createServer({
        port: specs.port,
        log: args.log_path,
        dir: args.contract_dir,
        spec: specs.spec,
        consumer: specs.consumer,
        provider: specs.provider
      });

      mockserver.start().then(() => {
        log(`Server for ${specs.provider} -> ${specs.consumer} started on port:${specs.port}`);
        filteredInteractions.forEach(interaction => {
          const pactProvider = Pact({
            consumer:interaction.consumer,
            provider:interaction.provider,
            port:specs.port
          });
          log(`Add Interaction "${interaction.interaction.state}" for ${interaction.provider} -> ${interaction.consumer}`);
          pactProvider.addInteraction(interaction.interaction);
        });
      });
    } else {
      log(`No Interactions for ${specs.provider} -> ${specs.consumer} found - not creating server`);
    }
  });
}
