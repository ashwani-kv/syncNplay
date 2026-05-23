const createBtn = document.getElementById('create-btn');
const joinBtn = document.getElementById('join-btn');
const roomInput = document.getElementById('room-input');
const status = document.getElementById('status');
const roomCode = document.getElementById('room-code');

function setStatus(msg) {
  status.textContent = msg;
}

function sendToContent(msg) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, msg);
  });
}

// Restore state when popup opens
chrome.storage.local.get(['roomId', 'isHost', 'joined'], (data) => {
  if (data.roomId && data.isHost) {
    setStatus('Room active! Share this code:');
    roomCode.textContent = data.roomId;
    createBtn.textContent = 'Leave Room';
    createBtn.style.background = '#444';
  } else if (data.roomId && data.joined) {
    setStatus(`Connected to room:`);
    roomCode.textContent = data.roomId;
    joinBtn.textContent = 'Leave Room';
    joinBtn.style.background = '#444';
  }
});

createBtn.addEventListener('click', () => {
  chrome.storage.local.get(['isHost'], (data) => {
    if (data.isHost) {
      // Leave room
      chrome.storage.local.clear();
      setStatus('');
      roomCode.textContent = '';
      createBtn.textContent = 'Create Room';
      createBtn.style.background = '#ff0000';
      sendToContent({ type: 'leave-room' });
      return;
    }
    setStatus('Creating room...');
    sendToContent({ type: 'create-room' });
  });
});

joinBtn.addEventListener('click', () => {
  chrome.storage.local.get(['joined'], (data) => {
    if (data.joined) {
      // Leave room
      chrome.storage.local.clear();
      setStatus('');
      roomCode.textContent = '';
      joinBtn.textContent = 'Join Room';
      joinBtn.style.background = '#222';
      sendToContent({ type: 'leave-room' });
      return;
    }
    const id = roomInput.value.trim().toUpperCase();
    if (!id || id.length !== 6) {
      setStatus('Enter a valid 6-character room code.');
      return;
    }
    setStatus('Joining room...');
    sendToContent({ type: 'join-room', roomId: id });
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'room-created') {
    chrome.storage.local.set({ roomId: msg.roomId, isHost: true });
    setStatus('Room active! Share this code:');
    roomCode.textContent = msg.roomId;
    createBtn.textContent = 'Leave Room';
    createBtn.style.background = '#444';
  }
  if (msg.type === 'room-joined') {
    chrome.storage.local.set({ roomId: msg.roomId, joined: true });
    setStatus('Connected to room:');
    roomCode.textContent = msg.roomId;
    joinBtn.textContent = 'Leave Room';
    joinBtn.style.background = '#444';
  }
  if (msg.type === 'error') {
    setStatus(`Error: ${msg.message}`);
  }
});