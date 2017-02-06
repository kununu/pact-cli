export function makeInteraction(data, interactionType) {
  switch (interactionType) {
    case 'js':
    return `var p = require('pact').Matchers;
  module.exports = {
    consumer: '${data.consumer}',
    provider: '${data.provider}',
    interaction: {
      state: '${data.state}',
      uponReceiving: '${data.uponReceiving}',
      withRequest: {
        method: '${data.method}',
        path: '${data.path}'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
      body: {
        items: p.eachLike({
          size: p.somethingLike(10),
          colour: p.term({matcher: "red|green|blue", generate: "blue"}),
          tag: p.eachLike(p.somethingLike("jumper"))
        }, {min: 10})
      }
    }
  }
};`
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
          body: [
            {"id": 1, "hello": "world"}
          ]
        }
      }
    }
  }
}
