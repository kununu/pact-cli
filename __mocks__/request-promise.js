import {getConfig} from '../src/__mocks__/helpers';

function getMatchUri (tag) {
  return `${getConfig().brokerUrl}/pacts/provider/test-provider/consumer/test-consumer/latest` // eslint-disable-line
  + (tag ? `/${tag}` : '');
}

function request (url) {
  // TODO get rid of those globals
  switch (global.MOCK_REQUEST_SCENARIO) {
    case 'broker-latest-pact':
      // TODO: consider whether this should be tested here?
      expect(url).toMatchObject({
        json: true,
        uri: getMatchUri(global.MOCK_REQUEST_TAG),
      });
      return new Promise((resolve, reject) => { // eslint-disable-line
        resolve(require('./data/latest-tag-pact.json')); // eslint-disable-line
      });
    case 'broker-rc-pact':
      expect(url).toMatchObject({
        json: true,
        uri: getMatchUri(global.MOCK_REQUEST_TAG),
      });
      return new Promise((resolve, reject) => { // eslint-disable-line
        resolve(require('./data/rc-pact.json')); // eslint-disable-line
      });
    case 'subsequent-requests-feature-master':
      expect(url).toMatchObject({
        json: true,
        uri: getMatchUri(global.MOCK_REQUEST_TAG),
      });
      global.MOCK_REQUEST_SCENARIO = 'broker-latest-pact';
      global.MOCK_REQUEST_TAG = 'master';
      return new Promise((resolve, reject) => {
        reject({
          statusCode: 404,
        });
      });
    default:
      throw new Error('undefined scenario');
  }
}


module.exports = request;
