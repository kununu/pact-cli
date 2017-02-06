'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeInteraction = makeInteraction;
function makeInteraction(data, interactionType) {
  switch (interactionType) {
    case 'js':
      return 'var p = require(\'pact\').Matchers;\n  module.exports = {\n    consumer: \'' + data.consumer + '\',\n    provider: \'' + data.provider + '\',\n    interaction: {\n      state: \'' + data.state + '\',\n      uponReceiving: \'' + data.uponReceiving + '\',\n      withRequest: {\n        method: \'' + data.method + '\',\n        path: \'' + data.path + '\'\n      },\n      willRespondWith: {\n        status: 200,\n        headers: {\n          \'Content-Type\': \'application/json\',\n          \'Access-Control-Allow-Origin\': \'*\'\n        },\n      body: {\n        items: p.eachLike({\n          size: p.somethingLike(10),\n          colour: p.term({matcher: "red|green|blue", generate: "blue"}),\n          tag: p.eachLike(p.somethingLike("jumper"))\n        }, {min: 10})\n      }\n    }\n  }\n};';
    case 'json':
      return {
        consumer: data.consumer,
        provider: data.provider,
        interaction: {
          state: data.state,
          uponReceiving: data.uponReceiving,
          withRequest: {
            method: data.method,
            path: data.path
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
  }
}