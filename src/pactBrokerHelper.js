import url from 'url';
import path from 'path';

const request = require('request-promise');
const defaultTag = 'master';

export function getPactForTag(consumer, provider, brokerUrl, tag, retryMaster = false) {
  const brokerEndpoint = getBrokerEndpoint(
    'consumer-provider',
    {
      consumer,
      provider,
      tag
    }
  );

  const promise = requestUrlFromBroker({
    uri: `${brokerUrl}/${brokerEndpoint}`,
    json: true
  });

  if (retryMaster) {
    return promise
      .then((response) => {
        return response;
      }).catch((err) => {
        if (tag !==  defaultTag && err.statusCode && 404 === err.statusCode) {
          return getPactForTag(consumer, provider, brokerUrl, 'master');
        }
        // if none 404 propagate error
        throw err;
    });
  }

  return promise;
}

export function getVersionForPact(promiseFetchingPact) {

  return promiseFetchingPact.then((response) => {
    // return the current latest version
    return path.basename(
      url.parse(response._links.self.href).pathname
    );
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
