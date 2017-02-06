import fs from 'fs';
import prompt from 'prompt';
import {die, getConfig, readJSON, writeJSON, log} from './helpers';
import pact from '@pact-foundation/pact-node';
import path from 'path';
import {exec} from 'child_process';
import {makeInteraction} from './templates';

export function brokerPublishWizard(pushfile) {
  const config = getConfig();

  const schema = {
    properties: {
      consumerVersion: {
        message: 'A string containing a semver-style version',
        required: true
      },
      tags: {
        message: 'Comma seperated List of tags'
      }
    }
  }

  prompt.start();
  prompt.get(schema, function (err, res) {  
    if (res) {
      const opts = {
        pactUrls: [path.resolve(process.cwd(), pushfile)],
        pactBroker: config.brokerUrl,
        consumerVersion: res.consumerVersion
      }

      if (res.tags.trim() !== '') {
        Object.assign(opts, {
          tags: res.tags.split(','),
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
  });
}

export function serverWizard(file) {
  let servers;
  
  if (fs.existsSync(file)) {
    log(`Serverfile found, adding following Server to your config`);
    servers = readJSON(file);
  } else {
    log(`No Serverfile found, creating new @ ${file}`);
    servers = [];
  }

   const schema = {
    properties: {
      consumer: {
        message: 'The name of the consumer to be written to the pact contracts, defaults to none',
        default: 'consumer'
      },
      provider: {
        message: 'The name of the provider to be written to the pact contracts, defaults to none',
        default: 'provider'
      },
      port: {
        message: 'Port number that the server runs on',
        default: 8888,
        type: 'integer'
      },
      spec: {
        message: 'The pact specification version to use when writing pact contracts',
        default: 3,
        type: 'integer'
      }
    }
  }

  prompt.start();
  prompt.get(schema, function (err, res) {
    if (res) {
      servers.push(res);
      writeJSON(servers, file);
      log(`Serverfile written @${file}`);
    }
  });
}

export function brokerConfigWizard() {
  const schema = {
    properties: {
      brokerUrl: {
        message: 'URL to fetch the provider states for the given provider API'
      },
      brokerUser: {
        message: 'Username for Pact Broker basic authentication.'
      },
      brokerPassword: {
        message: 'Password for Pact Broker basic authentication'
      }
    }
  }
  prompt.start();
  prompt.get(schema, function (err, res) {
    if (res) {
      const config = {
        brokerUrl: res.brokerUrl,
        brokerUser: res.brokerUser,
        brokerPassword: res.brokerPassword
      }

      const HOME = process.env.HOME || process.env.USERPROFILE;
      const CONFIGPATH = `${HOME}/.pact-dev-server`;

      writeJSON(config, CONFIGPATH);
      log(`Config written @ ${CONFIGPATH}`);
    }
  });
}

export function interactionWizard(args) {

  if (!fs.existsSync(args.file))
    die(`Please create a Serverfile first`);

  const servers = readJSON(args.file);
  const suggestions = servers[0];
  const interactionPath = `${args.INTERACTIONNAME}.interaction`;
  const schema = {
    properties: {
      interactionType: {
        description: 'Interaction Type (json|js)',
        pattern: /(json|js)/,
        message: 'Not a valid option or this file already exists',
        default: 'json',
        conform: function(ext) {
            return !fs.existsSync(`${interactionPath}.${ext}`)
        } 
      },
      consumer: {
        pattern: /^[a-zA-Z\-]+$/,
        message: 'Consumer ID must be only letters and dashes',
        default: `${suggestions.consumer}`
      },
      provider: {
        pattern: /^[a-zA-Z\-]+$/,
        message: 'Provider ID must be only letters and dashes',
        default: `${suggestions.provider}`
      },
      state: {
        message: 'Given State',
        required: true,
      },
      uponReceiving: {
        message: 'Given When',
        required: true,
      },
      method: {
        pattern: /^[A-Z]+$/,
        required: true,
        default: 'GET'
      },
      path: {
        pattern: /^[a-zA-Z0-9\-\/:]+$/,
        required: true,
        default: '/'
      }
    }
  }
  prompt.start();
  prompt.get(schema, function (err, res) {
    if (res) {
      if (res.interactionType === 'json') {
        const pact = makeInteraction(res, 'json');
        writeJSON(pact, `${interactionPath}.json`);
      } else {
        const pact = makeInteraction(res, 'js');
        try {
          fs.writeFileSync(`${interactionPath}.js`, pact, 'utf8');
        } catch(e) {
          die(`Error occured while saving: ${interactionPath}.js \n${e}`);
        }
      }
    }
    exec(`open ${interactionPath}.${res.interactionType}`);
  });
}
