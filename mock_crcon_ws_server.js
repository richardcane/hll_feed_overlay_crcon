const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 4000 });

console.log('🧪 Mock CRCON WebSocket running at ws://localhost:4000');

// Define players by team
const players = {
  Axis: [
    { name: 'IronWolf', steamId: '76561198000000001' },
    { name: 'PanzerAce', steamId: '76561198000000002' },
    { name: 'MG42Max', steamId: '76561198000000003' },
  ],
  Allies: [
    { name: 'TommyGun', steamId: '76561198000000011' },
    { name: 'YankSniper', steamId: '76561198000000012' },
    { name: 'CaptainJoe', steamId: '76561198000000013' },
  ],
};

const weapons = [
  'MP40',
  'M1 GARAND',
  'THOMPSON',
  'KARABINER 98K',
  'STG44',
  'BAR',
];

function getRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

wss.on('connection', (ws) => {
  console.log('🧪 Client connected to mock server');

  ws.on('message', (msg) => {
    console.log('🧪 Received filter criteria:', msg.toString());
  });

  // Send random KILL logs every 2 seconds
  setInterval(() => {
    // Random teams
    const killerTeam = Math.random() < 0.5 ? 'Axis' : 'Allies';
    const victimTeam = killerTeam === 'Axis' ? 'Allies' : 'Axis';

    const killer = getRandom(players[killerTeam]);
    const victim = getRandom(players[victimTeam]);
    const weapon = getRandom(weapons);
    const now = Date.now();

    const message = `${killer.name}(${killerTeam}/${killer.steamId}) -> ${victim.name}(${victimTeam}/${victim.steamId}) with ${weapon}`;

    const fakeKill = {
      logs: [
        {
          id: `${now}-0`,
          log: {
            version: 1,
            timestamp_ms: now,
            relative_time_ms: -100,
            raw: '',
            line_without_time: '',
            action: 'KILL',
            player: killer.name,
            steam_id_64_1: killer.steamId,
            player2: victim.name,
            steam_id_64_2: victim.steamId,
            weapon,
            message,
            sub_content: null,
          },
        },
      ],
    };

    ws.send(JSON.stringify(fakeKill));
  }, 2000);
});
