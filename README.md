# SyncNPlay 🎬

> Sync video playback across streaming platforms in real time — watch together, no matter where you are.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](docs/CONTRIBUTING.md)
![Status](https://img.shields.io/badge/status-in%20development-orange)

---

## The Problem

Every watch-party tool is locked to one platform. Teleparty only works on Netflix. Watch2gether only on YouTube. SyncNPlay fixes this by building a platform-agnostic sync layer that works across streaming sites.

---

## How It Works

```
Host (Tab 1)          WebSocket Server          Guest (Tab 2)
     │                       │                       │
     │── play/pause/seek ────▶│                       │
     │                       │──── broadcast ────────▶│
     │                       │                  syncs video
```

1. Host creates a room → shares the room code
2. Guest joins using the code
3. Every play / pause / seek by the host syncs to all guests instantly

---

## Features

- 🔁 Real-time play, pause, and seek sync
- 🚪 Room-based sessions — no account needed
- 🌐 Cross-platform support *(in progress)*
- ⚡ Low-latency via WebSockets

---

## Supported Platforms

| Platform       |        Status           |
|----------------|-------------------------|
| YouTube        |      🔄 In Progress     |
| Netflix        |      📋 Planned         |
| Prime Video    |      📋 Planned         |
| Hotstar        |      📋 Planned         |

---

## Project Structure

```
syncnplay/
├── extension/
│   ├── manifest.json      # Extension config (Manifest V3)
│   ├── content.js         # Injected into streaming sites
│   ├── background.js      # Service worker + WebSocket manager
│   ├── popup.html         # Extension UI
│   ├── popup.js
│   └── icons/
├── server/
│   ├── index.js           # WebSocket server (Node.js)
│   └── package.json
├── docs/
│   ├── CONTRIBUTING.md
│   └── ROADMAP.md
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- Chrome, Brave, or any Chromium-based browser

### 1. Clone the repo

```bash
git clone https://github.com/ashwani-kv/syncnplay.git
cd syncnplay
```

### 2. Start the WebSocket server

```bash
cd server
npm install
node index.js
# Server runs on ws://localhost:3000
```

### 3. Load the extension in Chrome

1. Go to `chrome://extensions`
2. Enable **Developer mode** (toggle, top right)
3. Click **Load unpacked**
4. Select the `extension/` folder

### 4. Test it

1. Open YouTube in two tabs
2. Click the SyncNPlay icon in both tabs
3. Create a room in Tab 1 → join with the code in Tab 2
4. Press play — both tabs sync

---

## Roadmap

- [x] Project structure and architecture
- [ ] WebSocket server with room management
- [ ] YouTube content script (detect + control video)
- [ ] Extension popup UI (create/join room)
- [ ] Netflix support
- [ ] Prime Video support
- [ ] Host-only controls
- [ ] In-session chat
- [ ] Firefox support

---

## Contributing

Read [CONTRIBUTING.md](docs/CONTRIBUTING.md) before opening a PR.

Good places to start:
- Issues labeled [`good first issue`](https://github.com/ashwani-kv/syncnplay/issues?q=label%3A%22good+first+issue%22)
- Adding support for a new streaming platform
- Improving the popup UI

---

## License

MIT © [Ashwani](https://github.com/ashwani-kv)
