import url from 'url';
import path from 'path';

const request = require('request-promise');

const defaultTag = 'master';

function requestUrlFromBroker (endpoint) {
  return request(endpoint);
}

export function getBrokerEndpoint (type, options) {
  switch (type) {
    /* eslint no-case-declarations: "off"*/
    case 'consumer-provider':
      const baseString = `pacts/provider/${options.provider}/consumer/${options.consumer}/latest`;
      return baseString + (options.tag ? `/${options.tag}` : '');
    default:
      throw new Error('not definied endpoint type');
  }
}

export function getVersionForPact (consumer, provider, brokerUrl, tag) {
  const brokerEndpoint = getBrokerEndpoint(
    'consumer-provider',
    {
      consumer,
      provider,
      tag,
    },
  );

  return requestUrlFromBroker({
    uri: `${brokerUrl}/${brokerEndpoint}`,
    json: true,
  }).then((response) =>
    // return the current latest version
     path.basename(
      url.parse(response._links.self.href).pathname, // eslint-disable-line
    )).catch((err) => {
      if (defaultTag !== tag && err.statusCode && err.statusCode === 404) {
        return getVersionForPact(consumer, provider, brokerUrl, 'master');
      }

      if (err.statusCode && err.statusCode === 404) {
        return '1.0.0';
      }
      // if not 404 propagate erro
      throw err;
    });
}


export function getParticipantFromPactfile (pactFile, participant) {
  return require(pactFile)[participant].name; // eslint-disable-line
}
