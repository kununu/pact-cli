import {getConfig} from '../src/__mocks__/helpers';


function request(url) {
  switch (global.MOCK_REQUEST_SCENARIO) {
    case 'broker-latest-pact':
        // TODO: consider whether this should be tested here?
        expect(url).toMatchObject({
          json: true,
          uri: `${getConfig().brokerUrl}/pacts/provider/test-provider/consumer/test-consumer/latest`
        });
        return new Promise((resolve, reject) => {
          resolve(require('./data/latest-tag-pact.json'));
        });
    default:
      throw new Error('non defined scenario');
  }
  return 'response';
}

module.exports = request;
