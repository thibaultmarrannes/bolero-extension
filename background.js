chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
      console.log(`Tab ${tabId} URL changed to: ${changeInfo.url}`);
  
      // Notify the popup about the URL change
      chrome.runtime.sendMessage({ tabId, url: changeInfo.url });
    }
  });