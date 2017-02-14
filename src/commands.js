import fs from 'fs';
import {die, getConfig, readJSON, writeJSON, log} from './helpers';
import pact from '@pact-foundation/pact-node';
import path from 'path';

export function verify(args) {
  const config = getConfig(); 
  const opts = {
    pactUrls: [path.resolve(process.cwd(), args.PACT_FILE)],
    providerBaseUrl: args.provider_url,
    providerStatesUrl: args.states_url,
    providerStatesSetupUrl: args.setup_url
  }

  if (config.brokerUser.trim() !== '') {
    Object.assign(opts, {
      pactBrokerUsername: config.brokerUser,
      pactBrokerPassword: config.brokerPassword
    });
  }

  pact.verifyPacts(opts).then((res) => {
    console.log(res);
  });
}

export function publish(args) {
  const config = getConfig(); 

  const opts = {
    pactUrls: [path.resolve(process.cwd(), args.PACT_FILE)],
    pactBroker: config.brokerUrl,
    consumerVersion: args.version
  }

  if (args.tags !== null) {
    Object.assign(opts, {
      tags: args.tags.split(','),
    });
  }

  if (config.brokerUser.trim() !== '') {
    Object.assign(opts, {
      pactBrokerUsername: config.brokerUser,
      pactBrokerPassword: config.brokerPassword
    });
  }

  pact.publishPacts(opts).then((pact) => {
    log('=================================================================================');
    log(`Pact ${pushfile} Published on ${config.brokerUrl}`);
    log('=================================================================================');
    console.log(JSON.stringify(pact, null, 2));
    log('=================================================================================');
  });
}
