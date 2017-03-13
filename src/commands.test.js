import {publish} from './commands';
import {publishPacts} from '@pact-foundation/pact-node';
import {getConfig} from './__mocks__/helpers';

jest.mock('@pact-foundation/pact-node', () => ({
  publishPacts: jest.fn(() => new Promise((resolve, reject) => {
    resolve('test');
  }))
}));

jest.mock('./helpers');

describe('publish pacts to broker', () => {
  beforeEach(() => {
    publishPacts.mockClear();
  });

  test('publish new pact without prexisting pact', () => {
    // mocked config
    const
      config = getConfig(),
      pactFile = '/only/test.json'
    ;

    publish({
      PACT_FILE: '/only/test.json',
      tags: null
    }, '/test');

    expect(publishPacts.mock.calls[0][0]).toMatchObject({
      consumerVersion: undefined,
      pactBroker: config.brokerUrl,
      pactUrls: [pactFile],
    });
  });
});
