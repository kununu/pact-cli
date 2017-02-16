export default function makeInteraction (data, interactionType) {
  switch (interactionType) {
    case 'js':
      return `module.exports = (Pact) => {
  return {
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
          items: Pact.eachLike({
            size: Pact.somethingLike(10),
            colour: Pact.term({matcher: "red|green|blue", generate: "blue"}),
            tag: Pact.eachLike(Pact.somethingLike("jumper"))
          }, {min: 10})
        }
      }
    }
  }
}`;
    case 'json':
      return {
        consumer: data.consumer,
        provider: data.provider,
        interaction: {
          state: data.state,
          uponReceiving: data.uponReceiving,
          withRequest: {
            method: data.method,
            path: data.path,
          },
          willRespondWith: {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            body: [
            {id: 1, hello: 'world'},
            ],
          },
        },
      };
    default:
      return undefined;
  }
}
