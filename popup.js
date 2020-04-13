let currentOnly = true;
let excludeMinimized = true;
let excludeMaximized = true;
let excludeFullscreen = true;
let maxForDomain = 3;
let mergeMode = 0;

let currentWinRadio = document.querySelector("#true");
let allWinRadio = document.querySelector("#false");
let excludeMin = document.querySelector("#min");
let excludeMax = document.querySelector("#max");
let excludeFull = document.querySelector("#full");
let excludeCheckBoxes = document.querySelectorAll("input[name=\"exclude\"]");
let mergeZ = document.querySelector("#Z");
let mergeN = document.querySelector("#N");
let mergeP = document.querySelector("#P");
let maxN = document.querySelector("#maxN");

chrome.storage.local.get("currentOnly", result => {
  if (typeof result.currentOnly === "undefined") {
    chrome.storage.local.set({"currentOnly": true});
    currentWinRadio.checked = true;
    currentOnly = true;
    mergeP.setAttribute("disabled", "");
    for (checkBox of excludeCheckBoxes) {
      checkBox.setAttribute("disabled", "");
    }
  } else {
    if (result.currentOnly) {
      currentWinRadio.checked = true;
      currentOnly = true;
      mergeP.setAttribute("disabled", "");
      for (checkBox of excludeCheckBoxes) {
        checkBox.setAttribute("disabled", "");
      }
    } else {
      allWinRadio.checked = true;
      currentOnly = false;
      mergeP.removeAttribute("disabled");
      for (checkBox of excludeCheckBoxes) {
        checkBox.removeAttribute("disabled");
      }
    }
  }
});

chrome.storage.local.get("excludeMinimized", result => {
  if (typeof result.excludeMinimized === "undefined") {
    chrome.storage.local.set({"excludeMinimized": true});
    excludeMinimized = true;
    excludeMin.checked = true;
  } else {
    excludeMinimized = result.excludeMinimized;
    excludeMin.checked = result.excludeMinimized;
  }
});

chrome.storage.local.get("excludeMaximized", result => {
  if (typeof result.excludeMaximized === "undefined") {
    chrome.storage.local.set({"excludeMaximized": true});
    excludeMaximized = true;
    excludeMax.checked = true;
  } else {
    excludeMaximized = result.excludeMaximized;
    excludeMax.checked = result.excludeMaximized;
  }
});

chrome.storage.local.get("excludeFullscreen", result => {
  if (typeof result.excludeFullscreen === "undefined") {
    chrome.storage.local.set({"excludeFullscreen": true});
    excludeFullscreen = true;
    excludeFull.checked = true;
  } else {
    excludeFullscreen = result.excludeFullscreen;
    excludeFull.checked = result.excludeFullscreen;
  }
});

chrome.storage.local.get("maxForDomain", result => {
  if (typeof result.maxForDomain === "undefined") {
    chrome.storage.local.set({"maxForDomain": 3});
    maxForDomain = 3;
    maxN.value = 3;
  } else {
    maxForDomain = result.maxForDomain;
    maxN.value = result.maxForDomain;
  }
});

chrome.storage.local.get("mergeMode", result => {
  if (typeof result.mergeMode === "undefined") {
    chrome.storage.local.set({"mergeMode": 0});
    mergeMode = 0;
    mergeZ.checked = true;
    maxN.setAttribute("disabled", "");
  } else {
    switch (result.mergeMode) {
      case -1:
        mergeMode = -1;
        mergeN.checked = true;
        maxN.removeAttribute("disabled");
        break;
      case 1:
        mergeMode = 1;
        mergeP.checked = true;
        maxN.setAttribute("disabled", "");
        break;
      default:
        mergeMode = 0;
        mergeZ.checked = true;
        maxN.setAttribute("disabled", "");
    }
  }
});

currentWinRadio.addEventListener("input",() => {
  if (currentWinRadio.checked) {
    chrome.storage.local.set({"currentOnly": true});
    currentOnly = true;
    for (checkBox of excludeCheckBoxes) {
      checkBox.setAttribute("disabled", "");
    }
    mergeP.setAttribute("disabled", "");
    if (mergeMode === 1) {
      chrome.storage.local.set({"mergeMode": 0});
      mergeMode = 0;
      mergeP.checked = false;
      mergeZ.checked = true;
    }
  } else {
    chrome.storage.local.set({"currentOnly": false});
    currentOnly = false;
    for (checkBox of excludeCheckBoxes) {
      checkBox.removeAttribute("disabled");
    }
    mergeP.removeAttribute("disabled");
  }
});

allWinRadio.addEventListener("input",() => {
  if (!allWinRadio.checked) {
    chrome.storage.local.set({"currentOnly": true});
    currentOnly = true;
    for (checkBox of excludeCheckBoxes) {
      checkBox.setAttribute("disabled", "");
    }
    mergeP.setAttribute("disabled", "");
    if (mergeMode === 1) {
      chrome.storage.local.set({"mergeMode": 0});
      mergeMode = 0;
      mergeP.checked = false;
      mergeZ.checked = true;
    }
  } else {
    chrome.storage.local.set({"currentOnly": false});
    currentOnly = false;
    for (checkBox of excludeCheckBoxes) {
      checkBox.removeAttribute("disabled");
    }
    mergeP.removeAttribute("disabled");
  }
});

excludeMin.addEventListener("input",() => {
  if (excludeMin.checked) {
    chrome.storage.local.set({"excludeMinimized": true});
    excludeMinimized = true
  } else {
    chrome.storage.local.set({"excludeMinimized": false});
    excludeMinimized = false
  }
});

excludeMax.addEventListener("input",() => {
  if (excludeMax.checked) {
    chrome.storage.local.set({"excludeMaximized": true});
    excludeMaximized = true
  } else {
    chrome.storage.local.set({"excludeMaximized": false});
    excludeMaximized = false
  }
});

excludeFull.addEventListener("input",() => {
  if (excludeFull.checked) {
    chrome.storage.local.set({"excludeFullscreen": true});
    excludeFullscreen = true
  } else {
    chrome.storage.local.set({"excludeFullscreen": false});
    excludeFullscreen = false
  }
});

mergeZ.addEventListener("input",() => {
  if (mergeZ.checked) {
    chrome.storage.local.set({"mergeMode": 0});
    mergeMode = 0;
  }

  maxN.setAttribute("disabled", "");
});

mergeN.addEventListener("input",() => {
  if (mergeN.checked) {
    chrome.storage.local.set({"mergeMode": -1});
    mergeMode = -1;
  }

  maxN.removeAttribute("disabled");
});

mergeP.addEventListener("input",() => {
  if (mergeP.checked) {
    chrome.storage.local.set({"mergeMode": 1});
    mergeMode = 1;
  }

  maxN.setAttribute("disabled", "");
});

maxN.addEventListener("input",() => {
  chrome.storage.local.set({"maxForDomain": parseInt(maxN.value)});
  maxForDomain = parseInt(maxN.value);
});

document.querySelector("#organize").onclick = () => {
  // console.log(`currentOnly: ${currentOnly}`);
  // console.log(`excludeMinimized: ${excludeMinimized}`);
  // console.log(`excludeMaximized: ${excludeMaximized}`);
  // console.log(`excludeFullscreen: ${excludeFullscreen}`);
  // console.log(`maxForDomain: ${maxForDomain}`);
  // console.log(`mergeMode: ${mergeMode}`);
  window.close();

  chrome.runtime.sendMessage({
    currentOnly: currentOnly,
    excludeMinimized: excludeMinimized,
    excludeMaximized: excludeMaximized,
    excludeFullscreen: excludeFullscreen,
    maxForDomain: maxForDomain,
    mergeMode: mergeMode
  });
};
