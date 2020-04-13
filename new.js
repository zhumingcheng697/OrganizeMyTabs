chrome.storage.local.get("newWindows", result => {
  if (typeof result.newWindows !== "undefined") {
    chrome.windows.getCurrent(win => {
      for (newWindow of result.newWindows) {
        if (win.id === newWindow.winId) {
          document.querySelector("h1").innerHTML = newWindow.key;
          document.title = newWindow.key;
        }
      }
    });
  }
});
