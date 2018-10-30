module.exports = function(app, extension) {
  const fs = require('fs');
  const jsonwebtoken = require('jsonwebtoken');
  const dateFormat = require('dateformat');
  let sequenceNumber = 0;

  app.use(require('body-parser').json());

  // Create endpoints for API in local mode.
  app.get('/extensions/:clientId/:version', (req, res) => {
    checkClientId(req.header('Client-ID'));
    checkToken(req.header('Authorization'));
    res.setHeader('Content-Type', 'application/json');
    if (extension) {
      res.writeHead(200);
      const data = {
        _total: 1,
        extensions: [extension],
      };
      res.end(JSON.stringify(data));
    } else {
      res.writeHead(500);
      res.end(JSON.stringify({ message: 'Extension not provided' }));
    }
  });

  app.post('/extensions/message/:channelId', (req, res) => {
    checkToken(req.header('Authorization'));
    const clientId = req.header('Client-ID');
    if (clientId) {
      const token = req.header('Authorization').split(' ')[1];
      const { payload } = jsonwebtoken.decode(token, { complete: true }) || {};
      if (payload && payload.pubsub_perms && payload.pubsub_perms.send) {
        const message = {
          time_sent: dateFormat(new Date(), 'isoUtcDateTime'),
          content_type: req.body.content_type,
          content: [req.body.message],
          sequence: { number: ++sequenceNumber, start: '2018-06-18T17:32:55Z' },
        };
        const payload = {
          type: 'MESSAGE',
          data: {
            topic: `channel-ext-v1.${req.params.channelId}-${clientId}-broadcast`,
            message: JSON.stringify(message) + '\r\n',
          }
        };
        broadcast(JSON.stringify(payload));
        res.writeHead(204);
        res.end();
      } else {
        res.writeHead(403);
        res.end(JSON.stringify({ message: 'Not authorized' }));
      }
    } else {
      res.writeHead(400);
      res.end(JSON.stringify({ message: 'Client-ID not provided' }));
    }
  });

  // Create a Web socket server for PubSub.
  const options = {
    key: fs.readFileSync('ssl/selfsigned.key'),
    cert: fs.readFileSync('ssl/selfsigned.crt')
  };
  const socketServer = require('https').createServer(options, (_req, res) => {
    res.writeHead(200);
    res.end('live');
  });
  const WebSocket = new require('ws');
  const wss = new WebSocket.Server({ server: socketServer });
  wss.on('connection', function(socket) {
    socket.on('message', function(message) {
      const data = JSON.parse(message);
      if (data.type === 'PING') {
        socket.send(JSON.stringify({ type: 'PONG' }));
      } else {
        wss.clients.forEach(function(client) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }
    });
  });
  socketServer.listen(3003);

  return { socketServer, wss };

  function checkClientId(clientIdHeaderValue) {
    if (process.env.EXT_CLIENT_ID && process.env.EXT_CLIENT_ID !== clientIdHeaderValue) {
      console.warn('Unexpected Client ID:', clientIdHeaderValue);
    }
  }

  function checkToken(authorizationHeaderValue) {
    if (process.env.EXT_SECRET) {
      const token = (authorizationHeaderValue || '').split(' ')[1] || '';
      try {
        jsonwebtoken.verify(token, new Buffer(process.env.EXT_SECRET, 'base64'));
      } catch (ex) {
        console.warn('Invalid JWT:', token || '(none)');
      }
    }
  }

  function broadcast(data) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
};
