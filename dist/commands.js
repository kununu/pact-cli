'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verify = verify;
exports.publish = publish;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _helpers = require('./helpers');

var _pactNode = require('@pact-foundation/pact-node');

var _pactNode2 = _interopRequireDefault(_pactNode);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _validUrl = require('valid-url');

var _validUrl2 = _interopRequireDefault(_validUrl);

var _pactBrokerHelper = require('./pactBrokerHelper');

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

  _pactNode2.default.verifyPacts(opts).then(function (pact) {
    (0, _helpers.log)('=================================================================================');
    (0, _helpers.log)('Pact ' + args.PACT_FILE + ' verified with following result');
    (0, _helpers.log)('=================================================================================');
    (0, _helpers.log)(JSON.stringify(pact, null, 2));
    (0, _helpers.log)('=================================================================================');
  }, function (err) {
    return (0, _helpers.log)('Verify failed because of \n' + err);
  });
}

function publish(args) {
  var config = (0, _helpers.getConfig)(),
      fullPactPath = _path2.default.resolve(process.cwd(), args.PACT_FILE),
      opts = {
    pactUrls: [_path2.default.resolve(process.cwd(), args.PACT_FILE)],
    pactBroker: config.brokerUrl,
    consumerVersion: args.version
  };

  if (args.tags) {
    Object.assign(opts, {
      tags: args.tags.split(',')
    });
  }

  if (!opts.tags) {
    Object.assign(opts, {
      tags: []
    });
  }

  if (args.branch) {
    opts.tags.push(args.branch);
    Object.assign(opts, {
      tags: opts.tags
    });
  }

  if (config.brokerUser.trim() !== '') {
    Object.assign(opts, {
      pactBrokerUsername: config.brokerUser,
      pactBrokerPassword: config.brokerPassword
    });
  }

  // set version from pact-broker if not given
  if (!args.version) {
    var consumer = (0, _pactBrokerHelper.getParticipantFromPactfile)(fullPactPath, 'consumer'),
        provider = (0, _pactBrokerHelper.getParticipantFromPactfile)(fullPactPath, 'provider');

    return (0, _pactBrokerHelper.getVersionForPact)(consumer, provider, config.brokerUrl, args.branch).then(function (version) {
      Object.assign(opts, {
        consumerVersion: (0, _helpers.bumpVersion)(version, args.branch)
      });

      return publishPacts(opts, args, config);
    }).catch(function (err) {
      (0, _helpers.log)('Couldn\'t publish pacts. Publish pacts returned');
      (0, _helpers.log)(err);
    });

    return;
  }

  return publishPacts(opts, args, config);
}

function publishPacts(opts, args, config) {
  return _pactNode2.default.publishPacts(opts).then(function (pact) {
    (0, _helpers.log)('=================================================================================');
    (0, _helpers.log)('Pact ' + args.PACT_FILE + ' Published on ' + config.brokerUrl);
    (0, _helpers.log)('=================================================================================');
    (0, _helpers.log)(JSON.stringify(pact, null, 2));
    (0, _helpers.log)('=================================================================================');
  }, function (err) {
    return (0, _helpers.log)('Publish failed because of \n' + err);
  });
}

// function publishWithVersion(opts, args, config, () => {
// console.
// });