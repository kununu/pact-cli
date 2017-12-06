import path from 'path';

import pact from '@pact-foundation/pact-node';

import validUrl from 'valid-url';

import {getConfig, log, bumpVersion} from './helpers';
import {getVersionForPact, getParticipantFromPactfile} from './pactBrokerHelper';

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

  pact.verifyPacts(opts).then((pactObject) => {
    log('=================================================================================');
    log(`Pact ${args.PACT_FILE} verified with following result`);
    log('=================================================================================');
    log(JSON.stringify(pactObject, null, 2));
    log('=================================================================================');
  }, (err) => log(`Verify failed because of \n${err}`));
}

function publishPacts (opts, args, config) {
  return pact.publishPacts(opts).then((pactObject) => {
    log('=================================================================================');
    log(`Pact ${args.PACT_FILE} Published on ${config.brokerUrl}`);
    log('=================================================================================');
    log(JSON.stringify(pactObject, null, 2));
    log('=================================================================================');
  }, (err) => log(`Publish failed because of \n${err}`));
}

export function publish (args) {
  const config = getConfig();
  const fullPactPath = path.resolve(process.cwd(), args.PACT_FILE);
  const opts = {
    pactFilesOrDirs: [path.resolve(process.cwd(), args.PACT_FILE)],
    pactBroker: config.brokerUrl,
    consumerVersion: args.version,
  };

  if (args.tags) {
    Object.assign(opts, {
      tags: args.tags.split(','),
    });
  }

  if (!opts.tags) {
    opts.tags = [];
  }

  if (args.branch) {
    opts.tags.push(args.branch);
    Object.assign(opts, {
      tags: opts.tags,
    });
  }

  if (config.brokerUser.trim() !== '') {
    Object.assign(opts, {
      pactBrokerUsername: config.brokerUser,
      pactBrokerPassword: config.brokerPassword,
    });
  }

  // set version from pact-broker if not given
  if (!args.version) {
    const consumer = getParticipantFromPactfile(fullPactPath, 'consumer');
    const provider = getParticipantFromPactfile(fullPactPath, 'provider');

    return getVersionForPact(consumer, provider, config.brokerUrl, args.branch)
      .then((version) => {
        Object.assign(opts, {
          consumerVersion: bumpVersion(version, args.branch),
        });

        return publishPacts(opts, args, config);
      }).catch((err) => {
        log('Couldn\'t publish pacts. Publishpacts returned:');
        log(err);
      });
  }

  return publishPacts(opts, args, config);
}
