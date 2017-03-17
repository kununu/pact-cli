import url from 'url';
import path from 'path';

const request = require('request-promise');
const defaultTag = 'master';

export function getVersionForPact(consumer, provider, brokerUrl, tag) {
  const brokerEndpoint = getBrokerEndpoint(
    'consumer-provider',
    {
      consumer,
      provider,
      tag
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
  }).catch((err) => {
    if (defaultTag !==  tag && err.statusCode && 404 === err.statusCode) {
      return getVersionForPact(consumer, provider, brokerUrl, 'master');
    }
    // if none 404 propagate erro
    throw err;
  });
}

export function getBrokerEndpoint(type, options) {
  switch (type) {
    case 'consumer-provider':
      const baseString =  `pacts/provider/${options.provider}/consumer/${options.consumer}/latest`;
      return baseString + (options.tag ? `/${options.tag}` : '');
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
