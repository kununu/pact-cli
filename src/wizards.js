import fs from 'fs';
import prompt from 'prompt';
import {writeJSON, log} from './helpers';

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
        default: 'test-frontend'
      },
      provider: {
        pattern: /^[a-zA-Z\-]+$/,
        message: 'Provider ID must be only letters and dashes',
        default: 'test-backend'
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
  });
}
