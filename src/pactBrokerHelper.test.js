import {requestUrlFromBroker} from './pactBrokerHelper';

const mockedResponse = {

}

jest.mock('request', () => (
  jest.fn(() => 'pseudo store object')
));

describe('request to pact-broker', () => {
  it('should request with given url', () => {
    expect(requestUrlFromBroker('http://127.0.0.1:5000/pacts')).toBe('pseudo store object');
  });
})
