chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "TEXT_SELECTED") {
    chrome.storage.local.set({ selectedText: message.text })
    }
})