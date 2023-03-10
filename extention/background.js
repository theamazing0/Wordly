// create variable for global use
var selection;

// create context menu for user to select text
browser.contextMenus.create({
  id: "open-selection-in-wordly",
  title: "Read with Wordly",
  contexts: ["selection"],
});

// handle selection of context menu
browser.contextMenus.onClicked.addListener((info) => {
  switch (info.menuItemId) {
    case "open-selection-in-wordly":
      // store the selection
      selection = info.selectionText;
      // open extention page for reading
      let createData = { url: "page/page.html" };
      let creating = browser.tabs.create(createData);
      break;
  }
});

// Prevent extention pages from being logged in history
browser.history.onVisited.addListener(onVisited);
function onVisited(historyItem) {
  if (historyItem.url === browser.extension.getURL(myPage)) {
    browser.history.deleteUrl({ url: historyItem.url });
  }
}

// Send user's selection to extention page after it requests it (which it does after load)
browser.runtime.onMessage.addListener(handleMessage);
function handleMessage(request, sender, sendResponse) {
  sendResponse(selection);
}
