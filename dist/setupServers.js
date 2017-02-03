'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInteractionsPromise = getInteractionsPromise;
exports.default = setupServers;

var _pact = require('pact');

var _pact2 = _interopRequireDefault(_pact);

var _pactNode = require('@pact-foundation/pact-node');

var _pactNode2 = _interopRequireDefault(_pactNode);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getInteractionsPromise(args) {
  return new Promise(function (resolve, reject) {
    (0, _helpers.log)('Searching for interaction files ...');

    var interactions = [];
    (0, _glob2.default)(args.glob, { ignore: 'node_modules/' }, function (err, files) {
      if (err) {
        reject(err);
      }

      files.forEach(function (file) {
        interactions.push((0, _helpers.readJSON)(file));
      });

      resolve(interactions);
    });
  });
}

function setupServers(args, servers, interactions) {
  (0, _helpers.log)('Startup Servers ...');

  servers.forEach(function (specs) {
    var filteredInteractions = interactions.filter(function (interaction) {
      return specs.consumer == interaction.consumer && specs.provider == interaction.provider;
    });

    if (filteredInteractions.length > 0) {
      var mockserver = _pactNode2.default.createServer({
        port: specs.port,
        log: args.log_path,
        dir: args.contract_dir,
        spec: specs.spec,
        consumer: specs.consumer,
        provider: specs.provider
      });

      mockserver.start().then(function () {
        (0, _helpers.log)('Server for ' + specs.provider + ' -> ' + specs.consumer + ' started on port:' + specs.port);

        filteredInteractions.forEach(function (interaction) {
          var pactProvider = (0, _pact2.default)({
            consumer: interaction.consumer,
            provider: interaction.provider,
            port: specs.port
          });
          var url = '(' + interaction.interaction.withRequest.method + ') http://localhost:' + specs.port + interaction.interaction.withRequest.path;
          (0, _helpers.log)('Add Interaction "' + interaction.interaction.state + '" on ' + url);
          pactProvider.addInteraction(interaction.interaction);
        });
      });
    } else {
      (0, _helpers.log)('No Interactions for ' + specs.provider + ' -> ' + specs.consumer + ' found - not creating server');
    }
  });
}