import path from 'path';
import {getVersionForPact, getBrokerEndpoint, getParticipantFromPactfile} from './pactBrokerHelper';
import {getConfig} from './helpers';

describe('version handling based on pact', () => {
  test('get version for pact provider consumer latest pact', () => {
    // set mock scenario used by /__mocks__/request.js
    global.MOCK_REQUEST_SCENARIO = 'broker-latest-pact';
    const
      consumer = 'test-consumer',
      provider = 'test-provider';

    const expectedVersion = '1.0.0';
    return getVersionForPact(consumer, provider, getConfig().brokerUrl)
      .then(version => expect(version).toBe(expectedVersion));
  });
});

describe('creation for pact-brokern endpoints', () => {
  test('undefined type throws error', () => {
    expect(() => {
      getBrokerEndpoint('not-given', {})
    }).toThrow();
  });

  test('get latest endpoint base on consumer and provider', () => {
    const options = {
      consumer: 'test-consumer',
      provider: 'test-provider',
    };

    expect(getBrokerEndpoint('consumer-provider', options)).toBe('pacts/provider/test-provider/consumer/test-consumer/latest');
  });
});

describe('Extract correct properties from pact', () => {
  ['provider', 'consumer'].forEach((participant) => {
    test(`get ${participant} from pact fullpath`, () => {
      expect(
        getParticipantFromPactfile(
          path.resolve(__dirname, '../__mocks__/data/test-pact-file.json'),
          participant
        )
      ).toBe(`test-${participant}`);
    });
  });
});
