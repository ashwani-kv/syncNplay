chrome.runtime.onMessage.addListener((msg, sender) => {
  // Forward messages from content script to popup
  chrome.runtime.sendMessage(msg).catch(() => {});
});