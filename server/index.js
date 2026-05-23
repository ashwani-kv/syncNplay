const { WebSocketServer } = require('ws');
const { v4: uuidv4 } = require('uuid');

const PORT = process.env.PORT || 3000;
const wss = new WebSocketServer({ port: PORT });

// rooms = { roomId: Set of WebSocket clients }
const rooms = new Map();

console.log(`SyncNPlay WebSocket server running on ws://localhost:${PORT}`);

wss.on('connection', (ws) => {
  ws.roomId = null;

  ws.on('message', (data) => {
    let msg;
    try {
      msg = JSON.parse(data);
    } catch {
      return;
    }

    switch (msg.type) {

      case 'create-room': {
        const roomId = uuidv4().slice(0, 6).toUpperCase();
        rooms.set(roomId, new Set([ws]));
        ws.roomId = roomId;
        ws.isHost = true;
        send(ws, { type: 'room-created', roomId });
        console.log(`Room created: ${roomId}`);
        break;
      }

      case 'join-room': {
        const { roomId } = msg;
        if (!rooms.has(roomId)) {
          send(ws, { type: 'error', message: 'Room not found' });
          return;
        }
        rooms.get(roomId).add(ws);
        ws.roomId = roomId;
        ws.isHost = false;
        send(ws, { type: 'room-joined', roomId });
        console.log(`Client joined room: ${roomId}`);
        break;
      }

      case 'sync': {
        // only host can broadcast sync events
        if (!ws.isHost) return;
        const room = rooms.get(ws.roomId);
        if (!room) return;
        room.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            send(client, { type: 'sync', action: msg.action, time: msg.time });
          }
        });
        break;
      }
    }
  });

  ws.on('close', () => {
    const room = rooms.get(ws.roomId);
    if (!room) return;
    room.delete(ws);
    if (room.size === 0) {
      rooms.delete(ws.roomId);
      console.log(`Room deleted: ${ws.roomId}`);
    }
  });
});

function send(ws, obj) {
  ws.send(JSON.stringify(obj));
}