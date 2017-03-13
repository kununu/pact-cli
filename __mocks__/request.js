
function request(url) {
  switch (global.MOCK_REQUEST_SCENARIO) {
    case 'broker-latest-pact':
        return new Promise((resolve, reject) => {
          resolve(require('./data/latest-tag-pact.json'));
        });
      break;
    default:
      throw new Error('non defined scenario');

  }
  return 'response';
}

module.exports = request;
