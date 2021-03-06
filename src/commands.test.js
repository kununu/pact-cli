import path from 'path';

import {publishPacts} from '@pact-foundation/pact-node';

import {publish} from './commands';
import {getConfig} from './__mocks__/helpers';

const requestPromise = require('request-promise');

jest.mock('@pact-foundation/pact-node', () => ({
  publishPacts: jest.fn(() => new Promise((resolve) => {
    resolve('test pact');
  })),
}));

jest.mock('./helpers');

describe('publish pacts to broker', () => {
  // variables need for publish call
  const config = getConfig();
  // process used for path resolving is in base test dir
  const pactFile = './__mocks__/data/test-pact-file.json';
  const pactFileFullPath = path.resolve(process.cwd(), pactFile);

  beforeEach(() => {
    publishPacts.mockClear();
  });

  afterEach(() => {
    requestPromise.unsetScenario();
  });

  // different scenarios to test against
  [
    {
      desc: 'added to tags list',
      tags: 'hello,world',
      branch: 'branch',
      version: '1.0.0',
      expectedTags: ['hello', 'world', 'branch'],
      expectedVersion: '1.0.0',
    },
    {
      desc: 'is master, bumps minor version',
      branch: 'master',
      version: null,
      expectedTags: ['master'],
      expectedVersion: '1.1.0',
      scenario: 'broker-latest-pact', // how broker request is resolved
    },
    {
      desc: 'is feature, bumps rc-version',
      branch: 'feature',
      expectedTags: ['feature'],
      expectedVersion: '1.1.0-rc.1',
      scenario: 'broker-rc-pact',
    },
    {
      desc: 'is feature with existent pact',
      branch: 'feature',
      expectedTags: ['feature'],
      expectedVersion: '1.1.0-rc.0',
      scenario: 'subsequent-requests-feature-master',
    },
    {
      desc: 'new master-pact without a branch on master',
      branch: 'feature',
      expectedTags: ['feature'],
      expectedVersion: '1.1.0-rc.0',
      scenario: '404',
    },
    {
      desc: 'new master-pact without a branch on master',
      branch: 'master',
      expectedTags: ['master'],
      expectedVersion: '1.1.0',
      scenario: '404',
    },
  ].forEach((item) => {
    test(`branch name ${item.desc}`, (done) => {
      if (item.scenario) {
        requestPromise.setScenario(item.scenario, item.branch);
        // global.MOCK_REQUEST_SCENARIO = item.scenario;
        // global.MOCK_REQUEST_TAG = item.branch;
      }
      publish({
        PACT_FILE: pactFile,
        tags: item.tags,
        branch: item.branch,
        version: item.version,
      }).then(() => {
        expect(publishPacts).toHaveBeenCalled();
        expect(publishPacts.mock.calls[0][0]).toMatchObject({
          pactBroker: config.brokerUrl,
          pactFilesOrDirs: [pactFileFullPath],
          tags: item.expectedTags,
          consumerVersion: item.expectedVersion,
        });
        done();
      });
    });
  });
});
