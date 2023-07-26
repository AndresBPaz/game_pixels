const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const WorldGenerator = require('./worldGenerator');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public'));

const worldGenerator = new WorldGenerator();

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  // El servidor escucha el evento 'message' del cliente WebSocket
  ws.on('message', (message) => {
    //console.log('Received message from client:', message);
    const data = JSON.parse(message);
    const { x, y, viewWidth, viewHeight } = data;
    console.log(data);
    const worldView = worldGenerator.generateWorldView(x, y, viewWidth, viewHeight);
    ws.send(JSON.stringify(worldView));
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP y WebSocket escuchando en el puerto ${PORT}.`);
});
