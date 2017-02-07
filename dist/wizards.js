'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.brokerPublishWizard = brokerPublishWizard;
exports.serverWizard = serverWizard;
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

var _templates = require('./templates');

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
        message: 'Comma seperated List of tags'
      }
    }
  };

  _prompt2.default.start();
  _prompt2.default.get(schema, function (err, res) {
    if (res) {
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
        (0, _helpers.log)('Pact ' + pushfile + ' Published on ' + config.brokerUrl);
        (0, _helpers.log)('=================================================================================');
        console.log(JSON.stringify(pact, null, 2));
        (0, _helpers.log)('=================================================================================');
      });
    }
  });
}

function serverWizard(file) {
  var servers = void 0;

  if (_fs2.default.existsSync(file)) {
    (0, _helpers.log)('Serverfile found, adding following Server to your config');
    servers = (0, _helpers.readJSON)(file);
  } else {
    (0, _helpers.log)('No Serverfile found, creating new @ ' + file);
    servers = [];
  }

  var schema = {
    properties: {
      consumer: {
        message: 'The name of the consumer to be written to the pact contracts, defaults to none',
        default: 'consumer'
      },
      provider: {
        message: 'The name of the provider to be written to the pact contracts, defaults to none',
        default: 'provider'
      },
      port: {
        message: 'Port number that the server runs on',
        default: 8888,
        type: 'integer'
      },
      spec: {
        message: 'The pact specification version to use when writing pact contracts',
        default: 3,
        type: 'integer'
      }
    }
  };

  _prompt2.default.start();
  _prompt2.default.get(schema, function (err, res) {
    if (res) {
      servers.push(res);
      (0, _helpers.writeJSON)(servers, file);
      (0, _helpers.log)('Serverfile written @' + file);
    }
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
    if (res) {
      var config = {
        brokerUrl: res.brokerUrl,
        brokerUser: res.brokerUser,
        brokerPassword: res.brokerPassword
      };

      var HOME = process.env.HOME || process.env.USERPROFILE;
      var CONFIGPATH = HOME + '/.pact-cli';

      (0, _helpers.writeJSON)(config, CONFIGPATH);
      (0, _helpers.log)('Config written @ ' + CONFIGPATH);
    }
  });
}

function interactionWizard(args) {

  if (!_fs2.default.existsSync(args.file)) (0, _helpers.die)('Please create a Serverfile first (pact-cli server add)');

  var servers = (0, _helpers.readJSON)(args.file);
  var suggestions = servers[0];
  var interactionPath = args.INTERACTIONNAME + '.interaction';
  var schema = {
    properties: {
      interactionType: {
        description: 'Interaction Type (json|js)',
        pattern: /(json|js)/,
        message: 'Not a valid option or this file already exists',
        default: 'json',
        conform: function conform(ext) {
          return !_fs2.default.existsSync(interactionPath + '.' + ext);
        }
      },
      consumer: {
        pattern: /^[a-zA-Z\-]+$/,
        message: 'Consumer ID must be only letters and dashes',
        default: '' + suggestions.consumer
      },
      provider: {
        pattern: /^[a-zA-Z\-]+$/,
        message: 'Provider ID must be only letters and dashes',
        default: '' + suggestions.provider
      },
      state: {
        message: 'Given State',
        required: true
      },
      uponReceiving: {
        message: 'Given When',
        required: true
      },
      method: {
        pattern: /^[A-Z]+$/,
        required: true,
        default: 'GET'
      },
      path: {
        pattern: /^[a-zA-Z0-9\-\/:]+$/,
        required: true,
        default: '/'
      }
    }
  };
  _prompt2.default.start();
  _prompt2.default.get(schema, function (err, res) {
    if (res) {
      if (res.interactionType === 'json') {
        var _pact = (0, _templates.makeInteraction)(res, 'json');
        (0, _helpers.writeJSON)(_pact, interactionPath + '.json');
      } else {
        var _pact2 = (0, _templates.makeInteraction)(res, 'js');
        try {
          _fs2.default.writeFileSync(interactionPath + '.js', _pact2, 'utf8');
        } catch (e) {
          (0, _helpers.die)('Error occured while saving: ' + interactionPath + '.js \n' + e);
        }
      }
    }
    (0, _child_process.exec)('open ' + interactionPath + '.' + res.interactionType);
  });
}