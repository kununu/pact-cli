'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verify = verify;
exports.publish = publish;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _validUrl = require('valid-url');

var _validUrl2 = _interopRequireDefault(_validUrl);

var _pactNode = require('@pact-foundation/pact-node');

var _pactNode2 = _interopRequireDefault(_pactNode);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function verify(args) {
  var config = (0, _helpers.getConfig)();
  var toValidate = _validUrl2.default.isUri(args.PACT_FILE) ? args.PACT_FILE : _path2.default.resolve(process.cwd(), args.PACT_FILE);

  var opts = {
    pactUrls: [toValidate],
    providerBaseUrl: args.provider_url,
    providerStatesUrl: args.states_url,
    providerStatesSetupUrl: args.setup_url
  };

  if (config.brokerUser.trim() !== '') {
    Object.assign(opts, {
      pactBrokerUsername: config.brokerUser,
      pactBrokerPassword: config.brokerPassword
    });
  }

  _pactNode2.default.verifyPacts(opts).then(function (pactObject) {
    (0, _helpers.log)('=================================================================================');
    (0, _helpers.log)('Pact ' + args.PACT_FILE + ' verified with following result');
    (0, _helpers.log)('=================================================================================');
    (0, _helpers.log)(JSON.stringify(pactObject, null, 2));
    (0, _helpers.log)('=================================================================================');
  }, function (err) {
    return (0, _helpers.log)('Verify failed because of \n' + err);
  });
}

function publish(args) {
  var config = (0, _helpers.getConfig)();

  var opts = {
    pactUrls: [_path2.default.resolve(process.cwd(), args.PACT_FILE)],
    pactBroker: config.brokerUrl,
    consumerVersion: args.version
  };

  if (args.tags !== null) {
    Object.assign(opts, {
      tags: args.tags.split(',')
    });
  }

  if (config.brokerUser.trim() !== '') {
    Object.assign(opts, {
      pactBrokerUsername: config.brokerUser,
      pactBrokerPassword: config.brokerPassword
    });
  }

  _pactNode2.default.publishPacts(opts).then(function (pactObject) {
    (0, _helpers.log)('=================================================================================');
    (0, _helpers.log)('Pact ' + args.PACT_FILE + ' Published on ' + config.brokerUrl);
    (0, _helpers.log)('=================================================================================');
    (0, _helpers.log)(JSON.stringify(pactObject, null, 2));
    (0, _helpers.log)('=================================================================================');
  }, function (err) {
    return (0, _helpers.log)('Publish failed because of \n' + err);
  });
}