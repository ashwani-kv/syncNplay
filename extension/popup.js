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

createBtn.addEventListener('click', () => {
  setStatus('Creating room...');
  sendToContent({ type: 'create-room' });
});

joinBtn.addEventListener('click', () => {
  const id = roomInput.value.trim().toUpperCase();
  if (!id || id.length !== 6) {
    setStatus('Enter a valid 6-character room code.');
    return;
  }
  setStatus('Joining room...');
  sendToContent({ type: 'join-room', roomId: id });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'room-created') {
    setStatus('Room created! Share this code:');
    roomCode.textContent = msg.roomId;
  }
  if (msg.type === 'room-joined') {
    setStatus(`Joined room ${msg.roomId}`);
  }
  if (msg.type === 'error') {
    setStatus(`Error: ${msg.message}`);
  }
});