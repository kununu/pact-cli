'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVersionForPact = getVersionForPact;
exports.getBrokerEndpoint = getBrokerEndpoint;
exports.getParticipantFromPactfile = getParticipantFromPactfile;

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var request = require('request-promise');
var defaultTag = 'master';

function getVersionForPact(consumer, provider, brokerUrl, tag) {
  var brokerEndpoint = getBrokerEndpoint('consumer-provider', {
    consumer: consumer,
    provider: provider,
    tag: tag
  });

  return requestUrlFromBroker({
    uri: brokerUrl + '/' + brokerEndpoint,
    json: true
  }).then(function (response) {
    // return the current latest version
    return _path2.default.basename(_url2.default.parse(response._links.self.href).pathname);
  }).catch(function (err) {
    if (defaultTag !== tag && err.statusCode && 404 === err.statusCode) {
      return getVersionForPact(consumer, provider, brokerUrl, 'master');
    }
    // if none 404 propagate erro
    throw err;
  });
}

function getBrokerEndpoint(type, options) {
  switch (type) {
    case 'consumer-provider':
      var baseString = 'pacts/provider/' + options.provider + '/consumer/' + options.consumer + '/latest';
      return baseString + (options.tag ? '/' + options.tag : '');
    default:
      throw new Error('not definied endpoint type');
  }
}

function getParticipantFromPactfile(pactFile, participant) {
  return require(pactFile)[participant].name;
}

function requestUrlFromBroker(endpoint) {
  return request(endpoint);
}