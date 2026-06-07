chrome.runtime.onMessage.addListener((message) => {
    if (message.type == "TYPE_SELECTED") {
        chrome.storage.local.set({ selectedtext: message.text })
    }
})