const request = require('request');

export function requestUrlFromBroker(endpoint) {
  return request(endpoint);
}
