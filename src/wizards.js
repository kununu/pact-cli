import fs from 'fs';
import prompt from 'prompt';
import {getConfig, readJSON, writeJSON, log} from './helpers';
import pact from '@pact-foundation/pact-node';
import path from 'path';
import {exec} from 'child_process';

export function brokerPublishWizard(pushfile) {
  const config = getConfig();

  const schema = {
    properties: {
      consumerVersion: {
        message: 'A string containing a semver-style version',
        required: true
      },
      tags: {
        message: 'Comma seperated List of strings'
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
    });
  }
}

export function interactionWizard(name) {
  const path = `${name}.interaction.json`;
  if (fs.exists(path))
    die(`File ${path} already exists`);
  
  log(`New Interaction File: ${path}\n`);

  const schema = {
    properties: {
      consumer: {
        pattern: /^[a-zA-Z\-]+$/,
        message: 'Consumer ID must be only letters and dashes',
        default: `${name}-consumer`
      },
      provider: {
        pattern: /^[a-zA-Z\-]+$/,
        message: 'Provider ID must be only letters and dashes',
        default: `${name}-provider`
      },
      state: {
        required: true,
        default: ''
      },
      uponReceiving: {
        required: true,
        default: ''
      },
      method: {
        pattern: /^[A-Z]+$/,
        required: true,
        default: 'GET'
      },
      path: {
        pattern: /^[a-zA-Z0-9\-\/]+$/,
        required: true,
        default: '/'
      }
    }
  }
  prompt.start();
  prompt.get(schema, function (err, res) {
    if (res) {
      const pact = {
        consumer: res.consumer,
        provider: res.provider,
        interaction: {
          state: res.state,
          uponReceiving: res.uponReceiving,
          withRequest: {
            method: res.method,
            path: res.path
          },
          willRespondWith: {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*"
            },
            body: [
              {"id": 1, "hello": "world"}
            ]
          }
        }
      }
      writeJSON(pact, path);
      exec(`open ${path}`);
    }
  });
}
