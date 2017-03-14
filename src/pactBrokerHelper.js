import url from 'url';
import path from 'path';

const request = require('request-promise');

export function getVersionForPact(consumer, provider, brokerUrl) {
  const brokerEndpoint = getBrokerEndpoint(
    'consumer-provider',
    {
      consumer,
      provider
    }
  );

  return requestUrlFromBroker({
    uri: `${brokerUrl}/${brokerEndpoint}`,
    json: true
  }).then((response) => {
      // return the current latest version
      return path.basename(
        url.parse(response._links.self.href).pathname
      );
    });
}

export function getBrokerEndpoint(type, options) {
  switch (type) {
    case 'consumer-provider':
      return `pacts/provider/${options.provider}/consumer/${options.consumer}/latest`;
    default:
      throw new Error('not definied endpoint type');
  }
}

export function getParticipantFromPactfile(pactFile, participant) {
  return require(pactFile)[participant].name;
}

function requestUrlFromBroker(endpoint) {
  return request(endpoint);
}
