import wrapper from '@pact-foundation/pact-node';
import {log} from './helpers';

export default function setupServers(args, servers) {
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
    mockserver.start().then(() => {
      log(`Server ${mockserver.__devserverId} started`);
    });
  });

  Promise.all(mockservers).then(stuff => {
    console.log(stuff.find(item => item._options.consumer === 'test-front').__devserverId);
  });
}
