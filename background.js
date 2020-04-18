let tabGroups = [];
let tabWindows = [];
let winIds = [];
let currentWin;
let currentOnly;
let excludeMinimized;
let excludeMaximized;
let excludeFullscreen;
let maxForDomain;
let mergeMode;

function isStandardUrl(url) {
  return !url.match(/^[A-Za-z]+:\/\//) || url.match(/^[A-Za-z]+:\/\//)[0].toLowerCase().startsWith("http");
}

function getPrefix(url) {
  return url.match(/^([A-Za-z]+):\/\//) ? url.match(/^([A-Za-z]+):\/\//)[1] : "";
}

function removePrefix(url) {
  return url.replace(/^[A-Za-z]+:\/\//, "");
}

function getDomainName(url) {
  return removePrefix(url).match(/^([^./:]+\.)*([^./:]+\.[^./:]+)/) ? removePrefix(url).match(/^([^./:]*\.)*([^./:]+\.[^./:]+)/)[2] : "";
}

function getHost(url) {
  return removePrefix(url).match(/^(([^./:]+\.)*([^./:]+\.[^./:]+)\/[^./:]+)[/.].+/) ? removePrefix(url).match(/^(([^./:]+\.)*([^./:]+\.[^./:]+)\/[^./:]+)[/.].+/)[1] : (removePrefix(url).match(/^([^./:]+\.)*([^./:]+\.[^./:]+)/) ? removePrefix(url).match(/^([^./:]*\.)*([^./:]+\.[^./:]+)/)[0] : "");
}

function selectWindows() {
  if (currentOnly) {
    chrome.windows.getCurrent({}, win => winIds.push(win.id));
  } else {
    chrome.windows.getAll({}, wins => {
      for (win of wins) {
        switch (win.state) {
          case "minimized":
          if (!excludeMinimized) {
            winIds.push(win.id);
          }
          break;
          case "maximized":
          if (!excludeMaximized) {
            winIds.push(win.id);
          }
          break;
          case "fullscreen":
          if (!excludeFullscreen) {
            winIds.push(win.id);
          }
          break;
          default:
          winIds.push(win.id);
        }
      }
    });
  }
}

function groupTab(tab) {
  if (tab.url && isStandardUrl(tab.url)) {
    let domainName = getDomainName(tab.url);
    if (domainName && domainName.match(/[A-Za-z]/gi)) {
      let groupForDomain = tabGroups.find(group => group.key === domainName)
      if (groupForDomain) {
        groupForDomain.tabs.push(tab);
      } else {
        tabGroups.push({key: domainName, tabs: [tab]});
      }
    } else if (getHost(tab.url)) {
      let groupForIP = tabGroups.find(group => group.key === `${getHost(tab.url)}`)
      if (groupForIP) {
        groupForIP.tabs.push(tab);
      } else {
        tabGroups.push({key: `${getHost(tab.url)}`, tabs: [tab]});
      }
    } else {
      let groupForErrorUrl = tabGroups.find(group => group.key === "* ERROR URL *")
      if (groupForErrorUrl) {
        groupForErrorUrl.tabs.push(tab);
      } else {
        tabGroups.push({key: "* ERROR URL *", tabs: [tab]});
      }
    }
  } else if (getPrefix(tab.url)) {
    let groupForPrefix = tabGroups.find(group => group.key === `** ${getPrefix(tab.url)} **`)
    if (groupForPrefix) {
      groupForPrefix.tabs.push(tab);
    } else {
      tabGroups.push({key: `** ${getPrefix(tab.url)} **`, tabs: [tab]});
    }
  } else {
    let groupForErrorUrl = tabGroups.find(group => group.key === "* ERROR URL *")
    if (groupForErrorUrl) {
      groupForErrorUrl.tabs.push(tab);
    } else {
      tabGroups.push({key: "* ERROR URL *", tabs: [tab]});
    }
  }
}

function sortGroups() {
  tabGroups.sort((groupA, groupB) => {
    if (groupA.key.match(/^([0-9]+\.)*[0-9]+/) && groupB.key.match(/^([0-9]+\.)*[0-9]+/) && parseInt(groupA.key) && parseInt(groupB.key)) {
      if (parseInt(groupA.key) < parseInt(groupB.key)) {
        return -1;
      } else if (parseInt(groupA.key) > parseInt(groupB.key)) {
        return 1;
      } else {
        return 0;
      }
    } else if (groupA.key.match(/^([0-9]+\.)*[0-9]+/) && !groupB.key.match(/^([0-9]+\.)*[0-9]+/) && parseInt(groupA.key) && !parseInt(groupB.key)) {
      if (!groupB.key.match(/^(\* ERROR URL \*)|(\*\* [A-Za-z]+ \*\*)$/)) {
        return -1;
      } else {
        return 1;
      }
    } else if (!groupA.key.match(/^([0-9]+\.)*[0-9]+/) && groupB.key.match(/^([0-9]+\.)*[0-9]+/) && !parseInt(groupA.key) && parseInt(groupB.key)) {
      if (!groupA.key.match(/^(\* ERROR URL \*)|(\*\* [A-Za-z]+ \*\*)$/)) {
        return 1;
      } else {
        return -1;
      }
    } else {
      if (groupA.key < groupB.key) {
        return -1;
      } else if (groupA.key > groupB.key) {
        return 1;
      } else {
        return 0;
      }
    }
  });
}

function sortTabsWithinGroup(group) {
  if (group.key.match(/^(\* ERROR URL \*)|(\*\* [A-Za-z]+ \*\*)$/) || !group.key.match(/[A-Za-z]/)) {
    group.tabs.sort((tabA, tabB) => {
      if (tabA.title < tabB.title) {
        return -1;
      } else if (tabA.title < tabB.title) {
        return 1;
      } else {
        return 0;
      }
    });
  } else {
    group.tabs.sort((tabA, tabB) => {
      if (getHost(tabA.url) < getHost(tabB.url)) {
        return -1;
      } else if (getHost(tabA.url) > getHost(tabB.url)) {
        return 1;
      } else {
        if (tabA.title < tabB.title) {
          return -1;
        } else if (tabA.title < tabB.title) {
          return 1;
        } else {
          return 0;
        }
      }
    });
  }
}

function combineLonelyTabs() {
  let lonelyTabs = [];
  for (group of tabGroups) {
    if (group.tabs.length >= maxForDomain) {
      tabWindows.push({newKey: group.key, tabs: group.tabs});
    } else {
      lonelyTabs = lonelyTabs.concat(group.tabs);
    }
  }
  if (lonelyTabs.length > 0) {
    tabWindows.push({newKey: "** Lonely Tabs **", tabs: lonelyTabs});
  }
}

function combineAllTabs() {
  let allTabs = [];
  for (group of tabGroups) {
    allTabs = allTabs.concat(group.tabs);
  }
  tabWindows.push({newKey: "** All Tabs **", tabs: allTabs});
}

function moveTabs() {
  if (tabWindows.length === 1) {
    for (tab of tabWindows[0].tabs) {
      chrome.tabs.move(tab.id, mergeMode === 0 ? {index: -1} : {windowId: currentWin.id, index: -1});
    }
  } else {
    let newWins = [];
    for (i = 0; i < tabWindows.length; i++) {
      let tabWin = tabWindows[i];
      chrome.windows.create({
        top: currentWin.top,
        left: currentWin.left,
        width: currentWin.width,
        height: currentWin.height,
        focused: false
      }, newWin => {
        newWins.push({winId: newWin.id, key: tabWin.newKey});
        for (tab of tabWin.tabs) {
          chrome.tabs.move(tab.id, {windowId: newWin.id, index: -1});
        }
        chrome.storage.local.set({"newWindows": newWins}, () => {
          chrome.tabs.query({windowId: newWin.id, index: 0}, blanks => {
            chrome.tabs.remove(blanks[0].id, () => {
                chrome.tabs.create({windowId: newWin.id, index: 0, url: "new.html"});
            });
          });
        });
      });
    }
  }
}

function organize() {

  chrome.tabs.query({url: "chrome-extension://*/new.html"}, tabs => {
    chrome.storage.local.remove("newWindows");

    tabs.forEach(tab => {
      chrome.tabs.remove(tab.id)
    });

    tabGroups = [];
    tabWindows = [];
    winIds = [];

    chrome.windows.getCurrent({}, win => currentWin = win);

    selectWindows();

    chrome.tabs.query({}, tabs => {

      tabs.forEach(tab => {
        if (winIds.includes(tab.windowId)) {
          groupTab(tab);
        }
      });

      sortGroups();

      for (group of tabGroups) {
        sortTabsWithinGroup(group)
      }

      if (mergeMode === -1) {
        combineLonelyTabs();
      } else {
        combineAllTabs();
      }

      moveTabs();

      chrome.browserAction.setBadgeText({text: 'Done'});

      setTimeout(() => {
        chrome.browserAction.setBadgeText({text: ''});
      }, 2000);
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (sender.url.endsWith("popup.html")) {
    currentOnly = request.currentOnly;
    excludeMinimized = request.excludeMinimized;
    excludeMaximized = request.excludeMaximized;
    excludeFullscreen = request.excludeFullscreen;
    maxForDomain = request.maxForDomain;
    mergeMode = request.mergeMode;

    organize();
  }
});
