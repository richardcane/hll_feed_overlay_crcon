const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { logStreamManager } = require('./src/log_stream_manager');
const { parseArgs, shouldShowKill } = require('./src/helpers/filters');

const filters = parseArgs();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const connectedClients = new Set();

wss.on('connection', (ws) => {
  connectedClients.add(ws);
  ws.on('close', () => connectedClients.delete(ws));
});

logStreamManager.subscribe('KILL');
logStreamManager.on('KILL', (log) => {
  if (!shouldShowKill(log, filters)) return;

  const data = JSON.stringify({ type: 'KILL', payload: log });
  for (const client of connectedClients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  }
});

app.get('/filters.json', (req, res) => {
    res.json(filters);
  });

app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎯 Kill Feed Server running at http://localhost:${PORT}`);
  console.log('🛠 Filters:', filters);
});