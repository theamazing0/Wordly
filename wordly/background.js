var selection = ""

function onCreated(tab) {
  console.log("Tab Created")
  // var loop = true
  // while (loop = true) {
  //   const sending = browser.tabs.sendMessage(tab.id, {selection:selection}).then((response) => {
  //       loop = false
  //       console.log("Message from the content script:");
  //       console.log(response.response);
  //     })
  // }
}

function onError(error) {
  console.log(`Error: ${error}`);
}

browser.contextMenus.create({
    id: "open-selection-in-wordly",
    title: "Read with Wordly",
    contexts: ["selection"],
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  switch (info.menuItemId) {
    case "open-selection-in-wordly":
      selection = info.selectionText;
      let createData = {url: "page/page.html"};
      let creating = browser.tabs.create(createData);
      creating.then(onCreated, onError);
      break;
  }
});

function onVisited(historyItem) {
  if (historyItem.url === browser.extension.getURL(myPage)) {
    browser.history.deleteUrl({url: historyItem.url});
  }
}

function handleMessage(request, sender, sendResponse) {
  sendResponse(selection);
}

browser.runtime.onMessage.addListener(handleMessage);

browser.history.onVisited.addListener(onVisited);
