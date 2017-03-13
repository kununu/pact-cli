'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVersionForPact = getVersionForPact;
exports.getBrokerEndpoint = getBrokerEndpoint;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('request');

function getVersionForPact(consumer, provider) {
  var brokerEndpoint = getBrokerEndpoint('consumer-provider', {
    consumer: consumer,
    provider: provider
  });

  return requestUrlFromBroker(brokerEndpoint).then(function (response) {
    // return the current latest version
    return _path2.default.basename(_url2.default.parse(response._links.self.href).pathname);
  });
}

function getBrokerEndpoint(type, options) {
  switch (type) {
    case 'consumer-provider':
      return '/pacts/provider/' + options.provider + '/' + options.consumer + '/latest';
      break;
    default:
      throw new Error('not definied endpoint type');
  }
}

function requestUrlFromBroker(endpoint) {
  return request(endpoint);
}