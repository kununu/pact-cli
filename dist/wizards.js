'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.brokerPublishWizard = brokerPublishWizard;
exports.brokerConfigWizard = brokerConfigWizard;
exports.interactionWizard = interactionWizard;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _prompt = require('prompt');

var _prompt2 = _interopRequireDefault(_prompt);

var _helpers = require('./helpers');

var _pactNode = require('@pact-foundation/pact-node');

var _pactNode2 = _interopRequireDefault(_pactNode);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function brokerPublishWizard(pushfile) {
  var config = (0, _helpers.getConfig)();

  var schema = {
    properties: {
      consumerVersion: {
        message: 'A string containing a semver-style version',
        required: true
      },
      tags: {
        message: 'Comma seperated List of strings'
      }
    }
  };

  _prompt2.default.start();
  _prompt2.default.get(schema, function (err, res) {
    var opts = {
      pactUrls: [_path2.default.resolve(process.cwd(), pushfile)],
      pactBroker: config.brokerUrl,
      consumerVersion: res.consumerVersion
    };

    if (res.tags.trim() !== '') {
      Object.assign(opts, {
        tags: res.tags.split(',')
      });
    }

    if (config.brokerUser.trim() !== '') {
      Object.assign(opts, {
        pactBrokerUsername: config.brokerUser,
        pactBrokerPassword: config.brokerPassword
      });
    }

    _pactNode2.default.publishPacts(opts).then(function (pact) {
      (0, _helpers.log)('=================================================================================');
      (0, _helpers.log)('Pact ' + pushfile + ' Published');
      (0, _helpers.log)('=================================================================================');
      console.log(JSON.stringify(pact, null, 2));
      (0, _helpers.log)('=================================================================================');
    });
  });
}

function brokerConfigWizard() {
  var schema = {
    properties: {
      brokerUrl: {
        message: 'URL to fetch the provider states for the given provider API'
      },
      brokerUser: {
        message: 'Username for Pact Broker basic authentication.'
      },
      brokerPassword: {
        message: 'Password for Pact Broker basic authentication'
      }
    }
  };
  _prompt2.default.start();
  _prompt2.default.get(schema, function (err, res) {
    var config = {
      brokerUrl: res.brokerUrl,
      brokerUser: res.brokerUser,
      brokerPassword: res.brokerPassword
    };

    var HOME = process.env.HOME || process.env.USERPROFILE;
    var CONFIGPATH = HOME + '/.pact-dev-server';

    (0, _helpers.writeJSON)(config, CONFIGPATH);
    (0, _helpers.log)('Config written @ ' + CONFIGPATH);
  });
}

function interactionWizard(name) {
  var path = name + '.interaction.json';
  if (_fs2.default.exists(path)) die('File ' + path + ' already exists');

  (0, _helpers.log)('New Interaction File: ' + path + '\n');

  var schema = {
    properties: {
      consumer: {
        pattern: /^[a-zA-Z\-]+$/,
        message: 'Consumer ID must be only letters and dashes',
        default: 'test-frontend'
      },
      provider: {
        pattern: /^[a-zA-Z\-]+$/,
        message: 'Provider ID must be only letters and dashes',
        default: 'test-backend'
      },
      state: {
        required: true,
        default: ''
      },
      uponReceiving: {
        required: true,
        default: ''
      },
      method: {
        pattern: /^[A-Z]+$/,
        required: true,
        default: 'GET'
      },
      path: {
        pattern: /^[a-zA-Z0-9\-\/]+$/,
        required: true,
        default: '/'
      }
    }
  };
  _prompt2.default.start();
  _prompt2.default.get(schema, function (err, res) {
    var pact = {
      consumer: res.consumer,
      provider: res.provider,
      interaction: {
        state: res.state,
        uponReceiving: res.uponReceiving,
        withRequest: {
          method: res.method,
          path: res.path
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
          body: [{ "id": 1, "hello": "world" }]
        }
      }
    };
    (0, _helpers.writeJSON)(pact, path);
    (0, _child_process.exec)('open ' + path);
  });
}