const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({
  dev
});
const nextHandler = nextApp.getRequestHandler();

// fake DB
const messages = {
  chat1: [],
  chat2: [],
}

// // socket.io server
// io.on('connection', socket => {
//   // socket.on('message.chat1', data => {
//   //   messages['chat1'].push(data)
//   //   socket.broadcast.emit('message.chat1', data)
//   // })
//   // socket.on('message.chat2', data => {
//   //   messages['chat2'].push(data)
//   //   socket.broadcast.emit('message.chat2', data)
//   // })
//   socket.emit('InitialMessage', 'Hello World');
// })

nextApp.prepare().then(() => {
  app.get('/messages/:chat', (req, res) => {
    res.json(messages[req.params.chat])
  })

  app.get('*', (req, res) => {
    return nextHandler(req, res)
  })

  server.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})

const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
// Spinning the http server and the websocket server.
const server2 = http.createServer();
server2.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server2
});

// all active connections
const clients = {};

function hashCode(s) {
  for (var i = 0, h = 0; i < s.length; i++)
    h = Math.imul(31, h) + s.charCodeAt(i) | 0;
  return h;
}

// This code generates unique userid for everyuser.
const getUniqueID = (connection) => {
  return Math.floor(hashCode(connection.address + ("" + connection.port)) * 0x1010101010).toString(16).substring(1).replace(/(.{4})/g, "$1-").slice(0, -1); // random Hex string (4-4-4-4)
};

wsServer.on('request', function (request) {
  const connection = request.accept(null, request.origin); // acctep connection from origin
  const userID = getUniqueID(connection.socket._peername); // generating clientID hash for ip and port
  clients[userID] = connection;
  console.log((new Date()) + ' Connection accepted from: ' + userID); // custom client-session-id
  connection.on('message', function (message) {
    if (message.type === 'utf8') {
      let json = JSON.parse(message.utf8Data);
      if(json.type == 'chatmessage')
        emitToAll({message: json.message, type: 'chatmessagefromuser'});
    } else if (message.type === 'binary') {
      console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
      // connection.sendBytes(message.binaryData);
    }
  });
  connection.on('close', function (reasonCode, description) {
    console.log((new Date()) + ' Connection closed from: ' + userID);
    delete clients[userID]; // remove client from list on Disconnect
  });
  connection.sendUTF(JSON.stringify({message:Object.keys(clients).length, type:'servermessage'}));
  setInterval(() => {
    emitToAll({message: Object.keys(clients).length, type: 'servermessage'});
  }, 5 * 60 * 1000); // every 5 min send active clients
});

const emitToAll = ({message, type}) => {
  for (const clientID in clients)
    clients[clientID].sendUTF(JSON.stringify({
      message,
      type
    }));
}