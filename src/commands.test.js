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
  beforeEach(() => {
    publishPacts.mockClear();
  });

  test('publish pact with prexisting pact', (done) => {

    // mocked config
    const
      config = getConfig(),
      pactFile = '/only/test.json'
    ;
    // set mock scenario for
    global.MOCK_REQUEST_SCENARIO = 'broker-latest-pact';

    publish({
      PACT_FILE: '/only/test.json',
      tags: null,
      version: null
    }, '/test').then(() => {
      expect(publishPacts).toHaveBeenCalled();
      expect(publishPacts.mock.calls.length).toBe(1);
      expect(publishPacts.mock.calls[0][0]).toMatchObject({
        consumerVersion: "1.0.1",
        pactBroker: config.brokerUrl,
        pactUrls: [pactFile],
      });
      done();
    });
  });
});
