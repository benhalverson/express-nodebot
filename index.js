/* eslint-disable no-console */
const express = require('express');
const WebSocket = require('ws');
// const five = require('johnny-five');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const crypto = require('crypto');
const goForward = require('./controllers/foward');

const wss = new WebSocket.Server({ port: 8080, handleProtocols: true });
const app = express();

function generateAcceptValue(acceptKey) {
  return crypto
    .createHash('sha1')
    .update(`${acceptKey}258EAFA5-E914–47DA-95CA-C5AB0DC85B11`, 'binary')
    .digest('base64');
}
app.on('upgrade', (req, socket) => {
  if (req.headers.upgrade !== 'websocket') {
    socket.end('HTTP/1.1 400 Bad Request');
  }
  // See mediumn post https://medium.com/hackernoon/implementing-a-websocket-server-with-node-js-d9b78ec5ffa8
  // Read the websocket key provided by the client:
  const acceptKey = req.headers['sec-websocket-key'];
  // Generate the response value to use in the response:
  const hash = generateAcceptValue(acceptKey);
  // Write the HTTP response into an array of response lines:
  const responseHeaders = ['HTTP/1.1 101 Web Socket Protocol Handshake', 'Upgrade: WebSocket', 'Connection: Upgrade', `Sec-WebSocket-Accept: ${hash}`];
  // Write the response back to the client socket, being sure to append two
  // additional newlines so that the browser recognises the end of the response
  // header and doesn't continue to wait for more header data:
  socket.write(`${responseHeaders.join('\r\n')}\r\n\r\n`);
  // Read the subprotocol from the client request headers:
  const protocol = req.headers['sec-websocket-protocol'];
  // If provided, they'll be formatted as a comma-delimited string of protocol
  // names that the client supports; we'll need to parse the header value, if
  // provided, and see what options the client is offering:
  const protocols = !protocol ? [] : protocol.split(',').map((s) => s.trim());
  // To keep it simple, we'll just see if JSON was an option, and if so, include
  // it in the HTTP response:
  if (protocols.includes('json')) {
  // Tell the client that we agree to communicate with JSON data
    responseHeaders.push('Sec-WebSocket-Protocol: json');
  }
});

app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));

app.use('/api/v1/go-foward', goForward);
// app.use('/api/v1/go-backward', goBackward);
// app.use('/api/v1/go-left', goLeft);
// app.use('/api/v1/go-right', goRight);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`express port is ${PORT}`);
});

wss.on('connection', (ws) => {
  console.log('wss connected');
  ws.on('message', (data) => {
    console.log(`message data: ${data}`);
  });
});
