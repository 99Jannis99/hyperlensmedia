/**
|--------------------------------------------------
| Links zum ändern
|--------------------------------------------------
*/
var websiteLink = "https://absolutenetwork.de/";
var logo = "images/absolutenetwork/logo_filled_round-back.svg";
var CompanyColor = 'rgba(255,255,255,1)';

/**
|--------------------------------------------------
| ab hier nichts ändern
|--------------------------------------------------
*/
var currentDevice
/**
|--------------------------------------------------
| detect Device and Browser
|--------------------------------------------------
*/
var deviceName = '';

var isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  Datalogic: function () {
    return navigator.userAgent.match(/DL-AXIS/i);
  },
  Bluebird: function () {
    return navigator.userAgent.match(/EF500/i);
  },
  Honeywell: function () {
    return navigator.userAgent.match(/CT50/i);
  },
  Zebra: function () {
    return navigator.userAgent.match(/TC70|TC55/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (isMobile.Datalogic() || isMobile.Bluebird() || isMobile.Honeywell() || isMobile.Zebra() || isMobile.BlackBerry() || isMobile.Android() || isMobile.iOS() || isMobile.Windows());
  }
};

if (isMobile.Datalogic())
  deviceName = 'Datalogic',
    currentDevice = "android";
else if (isMobile.Bluebird())
  deviceName = 'Bluebird',
    currentDevice = "android";
else if (isMobile.Honeywell())
  deviceName = 'Honeywell',
    currentDevice = "android";
else if (isMobile.Zebra())
  deviceName = 'Zebra',
    currentDevice = "android";
else if (isMobile.BlackBerry())
  deviceName = 'BlackBerry',
    currentDevice = "android";
else if (isMobile.iOS())
  deviceName = 'iOS',
    currentDevice = "ios";
else if ((deviceName == '') && (isMobile.Android()))
  deviceName = 'Android',
    currentDevice = "android";
else if ((deviceName == '') && (isMobile.Windows()))
  deviceName = 'Windows',
    currentDevice = "android";


let userAgent = navigator.userAgent;
let browserName;

if (userAgent.match(/chrome|chromium|crios/i)) {
  browserName = "chrome";
  deviceName == "iOS" ? currentDevice = "ios" : currentDevice = "android";
} else if (userAgent.match(/firefox|fxios/i)) {
  browserName = "firefox";
  deviceName == "iOS" ? currentDevice = "ios" : currentDevice = "android";
} else if (userAgent.match(/safari/i)) {
  browserName = "safari";
  currentDevice = "ios";
} else if (userAgent.match(/opr\//i)) {
  browserName = "opera";
  deviceName == "iOS" ? currentDevice = "ios" : currentDevice = "android";
} else if (userAgent.match(/edg/i)) {
  browserName = "edge";
  deviceName == "iOS" ? currentDevice = "ios" : currentDevice = "android";
} else {
  browserName = "No browser detection";
}


/**
|--------------------------------------------------
| append Elements
|--------------------------------------------------
*/

moduleContainer = document.createElement("div");
moduleContainer.classList.add("moduleContainer");
document.body.appendChild(moduleContainer)

var moduleCancelImg = document.createElement("IMG");
moduleCancelImg.setAttribute("src", "images/absolutenetwork/cancel.svg");
moduleCancelImg.setAttribute("height", "12px");
moduleCancelImg.setAttribute("id", "moduleCancelImg");
moduleCancelImg.classList.add("moduleCancelImg");
window.innerWidth > 500 ? moduleContainer.appendChild(moduleCancelImg) : null;

var moduleLogoImg = document.createElement("IMG");
moduleLogoImg.setAttribute("src", logo);
moduleLogoImg.setAttribute("height", "80px");
moduleLogoImg.classList.add("moduleLogoImg");
moduleContainer.appendChild(moduleLogoImg)

moduleText = document.createElement("h1");
moduleText.classList.add("moduleText");
moduleText.innerHTML = "If you're looking to create an outstanding website like this one, reach out to <span style='font-size: 16px; font-weight: 800;'>Absolute Network</span> for professional assistance.";
moduleText.style.fontSize = "14px";
moduleText.style.maxWidth = "300px";
moduleText.style.lineHeight = "1.2";
moduleText.style.color = "#000000";
moduleText.style.margin = "0 10px";
window.innerWidth > 355 ? moduleContainer.appendChild(moduleText) : null;

var moduleLink = document.createElement("a");
moduleLink.setAttribute("href", websiteLink);
moduleLink.setAttribute("target", "_blank");
moduleLink.classList.add("moduleLink");
moduleContainer.appendChild(moduleLink)

var moduleButtonImg = document.createElement("button");
moduleButtonImg.textContent = "Visit Website";
moduleButtonImg.style.padding = "10px 20px";
moduleButtonImg.style.borderRadius = "5px";
moduleButtonImg.style.border = "none";
moduleButtonImg.style.backgroundColor = "#010101";
moduleButtonImg.style.color = "white";
moduleButtonImg.style.cursor = "pointer";
moduleButtonImg.style.fontSize = "14px";
moduleButtonImg.classList.add("moduleButtonImg");
moduleLink.appendChild(moduleButtonImg);


/**
|--------------------------------------------------
| CSS
|--------------------------------------------------
*/
const moduleContainerCSS = document.querySelector('.moduleContainer');
const body = document.querySelector('body');
body.style.margin = '0px';
moduleContainerCSS.style.backgroundColor = CompanyColor;
moduleContainerCSS.style.boxShadow = "5px 4px 16px 0px #000000";
moduleContainerCSS.style.borderRadius = "10px";
moduleContainerCSS.style.position = "fixed";
moduleContainerCSS.style.padding = window.innerWidth < 500 ? "10px" : "15px";
moduleContainerCSS.style.left = "50%";
moduleContainerCSS.style.marginLeft = window.innerWidth < 500 ? "-47.2vw" : "-300px";
moduleContainerCSS.style.display = "flex";
moduleContainerCSS.style.justifyContent = "space-around";
moduleContainerCSS.style.alignItems = "center";
moduleContainerCSS.style.width = window.innerWidth < 500 ? "95vw" : '600px';
moduleContainerCSS.style.minHeight = '90px';
moduleContainerCSS.style.zIndex = "99999999999";
moduleContainerCSS.style.transition = "all 1000ms";
moduleContainerCSS.style.flexWrap = "wrap";
moduleContainerCSS.style.gap = "10px";

window.innerWidth > 500 ?
  styleCancelImg()
  : null;
function styleCancelImg() {
  const moduleCancelImgCSS = document.querySelector('.moduleCancelImg');
  moduleCancelImgCSS.style.position = "absolute";
  moduleCancelImgCSS.style.height = "12px";
  moduleCancelImgCSS.style.top = "15px";
  moduleCancelImgCSS.style.left = "15px";
  const moduleCancelImgFunc = document.getElementById("moduleCancelImg")
  moduleCancelImgFunc.addEventListener("click", () => { 
    const containerHeight = moduleContainerCSS.offsetHeight;
    const padding = parseInt(moduleContainerCSS.style.padding);
    const hidePosition = -(containerHeight + padding * 2 + 20);
    moduleContainerCSS.style.top = hidePosition + "px";
  });
  moduleCancelImgFunc.addEventListener('mouseover', () => {
    moduleCancelImgCSS.style.cursor = "pointer";
  });
}

const moduleLogoImgCSS = document.querySelector('.moduleLogoImg');
moduleLogoImgCSS.style.height = "80px";

const moduleButtonImgCSS = document.querySelector('.moduleButtonImg');
moduleButtonImgCSS.style.height = "45px";

window.innerWidth > 355 ?
  styleText()
  : null;
function styleText() {
  const moduleTextCSS = document.querySelector('.moduleText');
  moduleTextCSS.style.fontSize = "15px";
  moduleTextCSS.style.fontWeight = "bold";
  moduleTextCSS.style.margin = "0px";
  moduleTextCSS.style.padding = "0px";
}

const moduleLinkCSS = document.querySelector('.moduleLink');
moduleLink.style.height = "45px";

/**
|--------------------------------------------------
| animate
|--------------------------------------------------
*/
// Verzögere die Animation leicht, damit die Höhenberechnung korrekt ist
setTimeout(() => {
  const finalContainerHeight = moduleContainerCSS.offsetHeight;
  const finalPadding = parseInt(moduleContainerCSS.style.padding);
  const initialHidePosition = -(finalContainerHeight + finalPadding * 2 + 20);
  moduleContainerCSS.style.top = initialHidePosition + "px";
  
  setTimeout(() => {
    moduleContainerCSS.style.top = "10px";
  }, 100);
}, 0);


/**
|--------------------------------------------------
| Touchevents for closing
|--------------------------------------------------
*/
let touchStartY;
let touchMoveY;
let touchStartX;
let touchMoveX;
moduleContainerCSS.addEventListener("touchstart", e => {
  ;[...e.changedTouches].forEach(touch => {
    disableScroll();
    touchStartY = touch.pageY;
    touchStartX = touch.pageX;
  })
})
moduleContainerCSS.addEventListener("touchmove", e => {
  ;[...e.changedTouches].forEach(touch => {
    touchMoveY = touch.pageY;
    touchMoveX = touch.pageX;
  })
})
moduleContainerCSS.addEventListener("touchend", e => {
  if (touchStartY - 50 > touchMoveY) {
    moduleContainerCSS.style.top = "-100px";
  }
  if (touchStartX - 100 > touchMoveX) {
    moduleContainerCSS.style.left = "-550px";
  }
  if (touchStartX + 100 < touchMoveX) {
    moduleContainerCSS.style.left = "200vw";
  }

  touchStartY = null;
  touchMoveY = null;
  touchStartX = null;
  touchMoveX = null;

  enableScroll();
})

/**
|--------------------------------------------------
| Stop/Start Scolling
|--------------------------------------------------
*/

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; }
  }));
} catch (e) { }

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
  window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
  window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}