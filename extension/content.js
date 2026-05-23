const SERVER_URL = 'ws://localhost:3000';
let ws = null;
let isSyncing = false;

function getVideo() {
  return document.querySelector('video');
}

function connectWebSocket(roomId, isHost) {
  ws = new WebSocket(SERVER_URL);

  ws.onopen = () => {
    if (isHost) {
      ws.send(JSON.stringify({ type: 'create-room' }));
    } else {
      ws.send(JSON.stringify({ type: 'join-room', roomId }));
    }
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);

    switch (msg.type) {
      case 'room-created':
        chrome.storage.local.set({ roomId: msg.roomId, isHost: true });
        chrome.runtime.sendMessage({ type: 'room-created', roomId: msg.roomId });
        break;

      case 'room-joined':
        chrome.runtime.sendMessage({ type: 'room-joined', roomId: msg.roomId });
        break;

      case 'sync':
        applySyncAction(msg.action, msg.time);
        break;

      case 'error':
        chrome.runtime.sendMessage({ type: 'error', message: msg.message });
        break;
    }
  };

  ws.onclose = () => {
    console.log('SyncNPlay: disconnected');
  };
}

function applySyncAction(action, time) {
  const video = getVideo();
  if (!video) return;

  isSyncing = true;

  if (Math.abs(video.currentTime - time) > 0.5) {
    video.currentTime = time;
  }

  if (action === 'play') video.play();
  if (action === 'pause') video.pause();
  if (action === 'seek') video.currentTime = time;

  setTimeout(() => { isSyncing = false; }, 500);
}

function attachVideoListeners() {
  const video = getVideo();
  if (!video) return;

  video.addEventListener('play', () => {
    if (isSyncing) return;
    ws?.send(JSON.stringify({ type: 'sync', action: 'play', time: video.currentTime }));
  });

  video.addEventListener('pause', () => {
    if (isSyncing) return;
    ws?.send(JSON.stringify({ type: 'sync', action: 'pause', time: video.currentTime }));
  });

  video.addEventListener('seeked', () => {
    if (isSyncing) return;
    ws?.send(JSON.stringify({ type: 'sync', action: 'seek', time: video.currentTime }));
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'create-room') {
    connectWebSocket(null, true);
    attachVideoListeners();
  }
  if (msg.type === 'join-room') {
    connectWebSocket(msg.roomId, false);
    attachVideoListeners();
  }
});