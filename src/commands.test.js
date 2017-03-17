import path from 'path';

import {publish} from './commands';
import {publishPacts} from '@pact-foundation/pact-node';
import {getConfig} from './__mocks__/helpers';

jest.mock('@pact-foundation/pact-node', () => ({
  publishPacts: jest.fn((opts, args, config) => new Promise((resolve, reject) => {
    resolve('test pact');
  }))
}));

jest.mock('./helpers');

describe('publish pacts to broker', () => {
  // variables need for publish call
  const
    config = getConfig(),
    // process used for path resolving is in base test dir
    pactFile = './__mocks__/data/test-pact-file.json',
    pactFileFullPath = path.resolve(process.cwd(), pactFile)
  ;

  beforeEach(() => {
    publishPacts.mockClear();
  });
  // different scenarios to test against
  [
    {
      branch: 'master',
      version: '1.0.1',
    },
    // {
    //   branch: 'feature-branch',
    //   version: '1.1.0-rc.1'
    // }
  ].forEach((item) => {
    test(`publish pact from ${item.branch} with prexisting pact`, (done) => {
      // mocked config

      // set mock scenario for
      global.MOCK_REQUEST_SCENARIO = 'broker-latest-pact';

      publish({
        PACT_FILE: pactFile,
        tags: null,
        version: null
      }, '/test').then(() => {
        expect(publishPacts).toHaveBeenCalled();
        expect(publishPacts.mock.calls[0][0]).toMatchObject({
          consumerVersion: item.version,
          pactBroker: config.brokerUrl,
          pactUrls: [pactFileFullPath],
        });
        done();
      });
    });
  });

  [
    {
      desc: 'added to tags list',
      tags: 'hello,world',
      branch: 'branch',
      version: '1.0.0',
      accpectedTags: ['hello', 'world', 'branch'],
      accpectedVersion: '1.0.0'
    },
    {
      desc: 'is master, bumps minor version',
      branch: 'master',
      version: null,
      accpectedTags: ['master'],
      accpectedVersion: '1.1.0',

    },
    {
      desc: 'is feature, bumps to rc-version',
      branch: 'feature',
      accpectedTags: ['feature'],
      accpectedVersion: '1.1.0-rc.0',
    }
  ].forEach((item) => {
    test(`branch name ${item.desc}`, (done) => {

      publish({
        PACT_FILE: pactFile,
        tags: item.tags,
        branch: item.branch,
        version: item.version,
      }).then(() => {

        expect(publishPacts).toHaveBeenCalled();
        expect(publishPacts.mock.calls[0][0]).toMatchObject({
          consumerVersion: item.version,
          pactBroker: config.brokerUrl,
          pactUrls: [pactFileFullPath],
          tags: item.accpectedTags,
          consumerVersion: item.accpectedVersion,
        });
        done();
      });
    });
  //
  });
});
