import fs from 'fs';
import {die, getConfig, readJSON, writeJSON, log} from './helpers';
import pact from '@pact-foundation/pact-node';
import path from 'path';
import validUrl from 'valid-url';

export function verify (args) {
  const config = getConfig();
  const toValidate = validUrl.isUri(args.PACT_FILE) ? args.PACT_FILE : path.resolve(process.cwd(), args.PACT_FILE);

  const opts = {
    pactUrls: [toValidate],
    providerBaseUrl: args.provider_url,
    providerStatesUrl: args.states_url,
    providerStatesSetupUrl: args.setup_url,
  };

  if (config.brokerUser.trim() !== '') {
    Object.assign(opts, {
      pactBrokerUsername: config.brokerUser,
      pactBrokerPassword: config.brokerPassword,
    });
  }

  pact.verifyPacts(opts).then((pact) => {
    log('=================================================================================');
    log(`Pact ${args.PACT_FILE} verified with following result`);
    log('=================================================================================');
    log(JSON.stringify(pact, null, 2));
    log('=================================================================================');
  }, (err) => log(`Verify failed because of \n${err}`));
}

export function publish (args) {
  const config = getConfig();

  const opts = {
    pactUrls: [path.resolve(process.cwd(), args.PACT_FILE)],
    pactBroker: config.brokerUrl,
    consumerVersion: args.version,
  };

  if (args.tags !== null) {
    Object.assign(opts, {
      tags: args.tags.split(','),
    });
  }

  if (config.brokerUser.trim() !== '') {
    Object.assign(opts, {
      pactBrokerUsername: config.brokerUser,
      pactBrokerPassword: config.brokerPassword,
    });
  }

  pact.publishPacts(opts).then((pact) => {
    log('=================================================================================');
    log(`Pact ${args.PACT_FILE} Published on ${config.brokerUrl}`);
    log('=================================================================================');
    log(JSON.stringify(pact, null, 2));
    log('=================================================================================');
  }, (err) => log(`Publish failed because of \n${err}`));
}
