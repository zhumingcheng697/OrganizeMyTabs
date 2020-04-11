let currentWin = false;
let excludeMinimized = true;
let excludeMaximized = true;
let excludeFullscreen = true;
let maxForDomain = 3;
let currentOnly = true;
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

currentWinRadio.addEventListener("input",() => {
  if (currentWinRadio.checked) {
    currentWin = true;
    for (checkBox of excludeCheckBoxes) {
      checkBox.setAttribute("disabled", "");
    }
    mergeP.setAttribute("disabled", "");
    if (mergeMode === 1) {
      mergeMode = 0;
      mergeP.checked = false;
      mergeZ.checked = true;
    }
  } else {
    for (checkBox of excludeCheckBoxes) {
      currentWin = false;
      checkBox.removeAttribute("disabled");
    }
    mergeP.removeAttribute("disabled");
  }
});

allWinRadio.addEventListener("input",() => {
  if (!allWinRadio.checked) {
    currentWin = true;
    for (checkBox of excludeCheckBoxes) {
      checkBox.setAttribute("disabled", "");
    }
    mergeP.setAttribute("disabled", "");
    if (mergeMode === 1) {
      mergeMode = 0;
      mergeP.checked = false;
      mergeZ.checked = true;
    }
  } else {
    currentWin = false;
    for (checkBox of excludeCheckBoxes) {
      checkBox.removeAttribute("disabled");
    }
    mergeP.removeAttribute("disabled");
  }
});

excludeMin.addEventListener("input",() => {
  if (excludeMin.checked) {
    excludeMinimized = true
  } else {
    excludeMinimized = false
  }
});

excludeMax.addEventListener("input",() => {
  if (excludeMax.checked) {
    excludeMaximized = true
  } else {
    excludeMaximized = false
  }
});

excludeFull.addEventListener("input",() => {
  if (excludeFull.checked) {
    excludeFullscreen = true
  } else {
    excludeFullscreen = false
  }
});

mergeZ.addEventListener("input",() => {
  if (mergeZ.checked) {
    mergeMode = 0;
  }

  maxN.setAttribute("disabled", "");
});

mergeN.addEventListener("input",() => {
  if (mergeN.checked) {
    mergeMode = -1;
  }

  maxN.removeAttribute("disabled");
});

mergeP.addEventListener("input",() => {
  if (mergeP.checked) {
    mergeMode = 1;
  }

  maxN.setAttribute("disabled", "");
});

maxN.addEventListener("input",() => {
  maxForDomain = parseInt(maxN.value);
});
