#! /usr/bin/env node
'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helpers = require('./helpers');

var _setupServers = require('./setupServers');

var _setupServers2 = _interopRequireDefault(_setupServers);

var _wizards = require('./wizards');

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pkg = (0, _helpers.readJSON)(_path2.default.resolve(__dirname, '../package.json'));
var args = (0, _helpers.getParsedArgs)(pkg.version);
args.log_path = _path2.default.resolve(process.cwd(), args.log_path);

if (args.new) {
  (0, _wizards.interactionWizard)(args.new);
} else if (args.broker_config) {
  (0, _wizards.brokerConfigWizard)();
} else if (args.publish) {
  (0, _wizards.brokerPublishWizard)(args.publish);
} else {
  (function () {
    var servers = (0, _helpers.readJSON)(args.file);
    (0, _setupServers.getInteractionsPromise)(args).then(function (interactions) {
      (0, _setupServers2.default)(args, servers, interactions);
    }, function (err) {
      console.log(err);
    });
  })();
}