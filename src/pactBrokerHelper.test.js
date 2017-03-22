import path from 'path';
import {getVersionForPact, getBrokerEndpoint, getParticipantFromPactfile, getPactForTag} from './pactBrokerHelper';
import {getConfig} from './helpers';

describe('version handling based on pact', () => {

  afterEach(() => {
    delete global.MOCK_REQUEST_SCENARIO;
    delete global.MOCK_REQUEST_TAG;
    delete global.FAKE_TEST;
  });

  test('get version for pact provider consumer latest pact', (done) => {
    // set mock scenario used by /__mocks__/request.js
    global.MOCK_REQUEST_SCENARIO = 'broker-latest-pact';
    const
      consumer = 'test-consumer',
      provider = 'test-provider';

    const expectedVersion = '1.0.0';
    return getVersionForPact(
      getPactForTag(consumer, provider, getConfig().brokerUrl)
    ).then((version) => {
        expect(version).toBe(expectedVersion);
        done();
      });
  });

  test('get version for pact provider given feature tag', (done) => {
    global.MOCK_REQUEST_SCENARIO = 'broker-latest-pact';
    global.MOCK_REQUEST_TAG = 'feature';
    const
      consumer = 'test-consumer',
      provider = 'test-provider';

    const expectedVersion = '1.0.0';
    return getVersionForPact(
      getPactForTag(consumer, provider, getConfig().brokerUrl, 'feature')
    ).then((version) => {
      expect(version).toBe(expectedVersion);
      done();
    });
  });

  test('retry with master, when feature branch is 404 and retry flag is set', (done) => {
    global.MOCK_REQUEST_SCENARIO = 'subsequent-requests-feature-master';
    global.MOCK_REQUEST_TAG = 'feature';
    global.FAKE_TEST = 0;
    const
    consumer = 'test-consumer',
    provider = 'test-provider';

    const expectedVersion = '1.0.0';
    getPactForTag(consumer, provider, getConfig().brokerUrl, 'feature', true)
      .then((pactObject) => {
        expect(pactObject).toMatchObject(require('../__mocks__/data/latest-tag-pact.json'));
        done();
      });
  });

  test('get pact for given tag', (done) => {
    global.MOCK_REQUEST_SCENARIO = 'broker-latest-pact';
    global.MOCK_REQUEST_TAG = 'master';
    const
      consumer = 'test-consumer',
      provider = 'test-provider';

    getPactForTag(consumer, provider, getConfig().brokerUrl, 'master')
      .then((pactObject) => {
        expect(pactObject).toMatchObject(require('../__mocks__/data/latest-tag-pact.json'));
        done();
      });
  });
});

describe('creation for pact-brokern endpoints', () => {
  test('undefined type throws error', () => {
    expect(() => {
      getBrokerEndpoint('not-given', {})
    }).toThrow();
  });

  test('get latest endpoint base for consumer and provider', () => {
    const options = {
      consumer: 'test-consumer',
      provider: 'test-provider',
    };

    expect(getBrokerEndpoint('consumer-provider', options)).toBe('pacts/provider/test-provider/consumer/test-consumer/latest');
  });

  test('get endpoint base for consumer, provider, and tag', () => {
    const options = {
      consumer: 'test-consumer',
      provider: 'test-provider',
      tag: 'master'
    };

    expect(getBrokerEndpoint('consumer-provider', options)).toBe('pacts/provider/test-provider/consumer/test-consumer/latest/master');
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
