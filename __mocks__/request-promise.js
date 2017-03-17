import {getConfig} from '../src/__mocks__/helpers';


function request(url) {
  // TODO get rid of those globals
  switch (global.MOCK_REQUEST_SCENARIO) {
    case 'broker-latest-pact':
        // TODO: consider whether this should be tested here?
        expect(url).toMatchObject({
          json: true,
          uri: getMatchUri(global.MOCK_REQUEST_TAG)
        });
        return new Promise((resolve, reject) => {
          resolve(require('./data/latest-tag-pact.json'));
        });
    case 'broker-rc-pact':
      expect(url).toMatchObject({
        json: true,
        uri: getMatchUri(global.MOCK_REQUEST_TAG)
      });
      return new Promise((resolve, reject) => {
        resolve(require('./data/rc-pact.json'));
      });
    case 'subsequent-requests-feature-master':
      expect(url).toMatchObject({
        json: true,
        uri: getMatchUri(global.MOCK_REQUEST_TAG)
      });
      global.MOCK_REQUEST_SCENARIO = 'broker-latest-pact';
      global.MOCK_REQUEST_TAG = 'master';
      return new Promise((resolve, reject) => {
        reject({
          statusCode: 404
        });
      });
    default:
      throw new Error('undefined scenario');
  }
  return 'response';
}

function getMatchUri(tag) {
  return  `${getConfig().brokerUrl}/pacts/provider/test-provider/consumer/test-consumer/latest`
  + (tag ? `/${tag}` : '');
}

module.exports = request;
