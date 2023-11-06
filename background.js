let tabTitleStorage = {};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "renameTab") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      tabTitleStorage[activeTab.id] = request.newTitle;
      chrome.scripting.executeScript(
        {
          target: { tabId: activeTab.id },
          func: renameTab,
          args: [request.newTitle],
        },
        function () {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          }
          sendResponse({}); 
        }
      );
    });
    return true; 
  }
});

function renameTab(newTitle) {
  document.title = newTitle;
}

// 新增
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tabTitleStorage[tabId]) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        func: renameTab,
        args: [tabTitleStorage[tabId]],
      }
    );
  }
});