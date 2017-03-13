import url from 'url';
import path from 'path';

const request = require('request');

export function getVersionForPact(consumer, provider) {
  const brokerEndpoint = getBrokerEndpoint(
    'consumer-provider',
    {
      consumer,
      provider
    }
  );

  return requestUrlFromBroker(brokerEndpoint)
    .then((response) => {
      // return the current latest version
      return path.basename(
        url.parse(response._links.self.href).pathname
      );
    });
}

export function getBrokerEndpoint(type, options) {
  switch (type) {
    case 'consumer-provider':
      return `/pacts/provider/${options.provider}/${options.consumer}/latest`;
      break;
    default:
      throw new Error('not definied endpoint type');
  }
}

function requestUrlFromBroker(endpoint) {
  return request(endpoint);
}
