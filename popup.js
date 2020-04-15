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
    mergeP.setAttribute("disabled", "");
    for (checkBox of excludeCheckBoxes) {
      checkBox.setAttribute("disabled", "");
    }
  } else {
    if (result.currentOnly) {
      currentWinRadio.checked = true;
      mergeP.setAttribute("disabled", "");
      for (checkBox of excludeCheckBoxes) {
        checkBox.setAttribute("disabled", "");
      }
    } else {
      allWinRadio.checked = true;
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
    excludeMin.checked = true;
  } else {
    excludeMin.checked = result.excludeMinimized;
  }
});

chrome.storage.local.get("excludeMaximized", result => {
  if (typeof result.excludeMaximized === "undefined") {
    chrome.storage.local.set({"excludeMaximized": true});
    excludeMax.checked = true;
  } else {
    excludeMax.checked = result.excludeMaximized;
  }
});

chrome.storage.local.get("excludeFullscreen", result => {
  if (typeof result.excludeFullscreen === "undefined") {
    chrome.storage.local.set({"excludeFullscreen": true});
    excludeFull.checked = true;
  } else {
    excludeFull.checked = result.excludeFullscreen;
  }
});

chrome.storage.local.get("maxForDomain", result => {
  if (typeof result.maxForDomain === "undefined") {
    chrome.storage.local.set({"maxForDomain": 3});
    maxN.value = 3;
  } else {
    maxN.value = result.maxForDomain;
  }
});

chrome.storage.local.get("mergeMode", result => {
  if (typeof result.mergeMode === "undefined") {
    chrome.storage.local.set({"mergeMode": 0});
    mergeZ.checked = true;
    maxN.setAttribute("disabled", "");
  } else {
    switch (result.mergeMode) {
      case -1:
        mergeN.checked = true;
        maxN.removeAttribute("disabled");
        break;
      case 1:
        mergeP.checked = true;
        maxN.setAttribute("disabled", "");
        break;
      default:
        mergeZ.checked = true;
        maxN.setAttribute("disabled", "");
    }
  }
});

currentWinRadio.addEventListener("input",() => {
  if (currentWinRadio.checked) {
    chrome.storage.local.set({"currentOnly": true});
    for (checkBox of excludeCheckBoxes) {
      checkBox.setAttribute("disabled", "");
    }
    mergeP.setAttribute("disabled", "");
    if (document.querySelector("input[name=\"merge\"]:checked") && parseInt(document.querySelector("input[name=\"merge\"]:checked").value) === 1) {
      chrome.storage.local.set({"mergeMode": 0});
      mergeP.checked = false;
      mergeZ.checked = true;
    }
  } else {
    chrome.storage.local.set({"currentOnly": false});
    for (checkBox of excludeCheckBoxes) {
      checkBox.removeAttribute("disabled");
    }
    mergeP.removeAttribute("disabled");
  }
});

allWinRadio.addEventListener("input",() => {
  if (!allWinRadio.checked) {
    chrome.storage.local.set({"currentOnly": true});
    for (checkBox of excludeCheckBoxes) {
      checkBox.setAttribute("disabled", "");
    }
    mergeP.setAttribute("disabled", "");
    if (document.querySelector("input[name=\"merge\"]:checked") && parseInt(document.querySelector("input[name=\"merge\"]:checked").value) === 1) {
      chrome.storage.local.set({"mergeMode": 0});
      mergeP.checked = false;
      mergeZ.checked = true;
    }
  } else {
    chrome.storage.local.set({"currentOnly": false});
    for (checkBox of excludeCheckBoxes) {
      checkBox.removeAttribute("disabled");
    }
    mergeP.removeAttribute("disabled");
  }
});

excludeMin.addEventListener("input",() => {
  chrome.storage.local.set({"excludeMinimized": excludeMin.checked});
});

excludeMax.addEventListener("input",() => {
  chrome.storage.local.set({"excludeMaximized": excludeMax.checked});
});

excludeFull.addEventListener("input",() => {
  chrome.storage.local.set({"excludeFullscreen": excludeFull.checked});
});

mergeZ.addEventListener("input",() => {
  if (mergeZ.checked) {
    chrome.storage.local.set({"mergeMode": 0});
    maxN.setAttribute("disabled", "");
  }
});

mergeN.addEventListener("input",() => {
  if (mergeN.checked) {
    chrome.storage.local.set({"mergeMode": -1});
    maxN.removeAttribute("disabled");
  }
});

mergeP.addEventListener("input",() => {
  if (mergeP.checked) {
    chrome.storage.local.set({"mergeMode": 1});
    maxN.setAttribute("disabled", "");
  }
});

maxN.addEventListener("input",() => {
  chrome.storage.local.set({"maxForDomain": parseInt(maxN.value)});
});

document.querySelector("#organize").onclick = () => {

  window.close();

  chrome.runtime.sendMessage({
    currentOnly: currentWinRadio.checked,
    excludeMinimized: excludeMin.checked,
    excludeMaximized: excludeMax.checked,
    excludeFullscreen: excludeFull.checked,
    maxForDomain: parseInt(maxN.value),
    mergeMode: document.querySelector("input[name=\"merge\"]:checked") ? parseInt(document.querySelector("input[name=\"merge\"]:checked").value) : 0
  });
};
