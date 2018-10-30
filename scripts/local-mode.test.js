const jsonwebtoken = require('jsonwebtoken');
const localMode = require('./local-mode');

// Configure the local-mode module.
const getRoutes = {};
const postRoutes = {};
const app = {
  use: (_) => { },
  get: (route, fn) => (getRoutes[route] = fn),
  post: (route, fn) => (postRoutes[route] = fn),
};
const { socketServer, wss } = localMode(app);
const res = {
  setHeader: (name, value) => {
    console.log(`set header ${name} to ${value}`);
  },
  writeHead: (statusCode) => {
    console.log(`write head ${statusCode}`);
  },
  end: (s) => {
    console.log('end');
    console.log(s);
  },
};

process.env.EXT_SECRET = 'kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk';
runTests();

async function runTests() {
  let req;

  // Test extension retrieval.
  req = {
    header: (_name) => { },
  };
  await getRoutes['/extensions/:clientId/:version'](req, res);

  // Test PubSub send.
  req = {
    body: {
      content_type: 'application/json',
      message: 'message',
    },
    header: (name) => {
      const payload = {
        "exp": Date.now() + 9999,
        "iat": Date.now() - 99,
        "pubsub_perms": {
          "send": ["broadcast"],
        },
        "role": "broadcaster",
      };
      const token = jsonwebtoken.sign(payload, new Buffer(process.env.EXT_SECRET, 'base64'));
      const values = {
        Authorization: `Bearer ${token}`,
        'Client-ID': 'clientId',
      };
      return values[name];
    },
    params: {
      channelId:'channelId',
    },
  };
  await postRoutes['/extensions/message/:channelId'](req, res);

  socketServer.close();
  wss.close();
  console.log('done');
}
