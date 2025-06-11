function changelink(id) {
    var element = document.getElementById(id);

    element.classList.remove('link');
    element.classList.add('visited');
}

function copy() {
    const text = "idkwhereisthisname";
    let alertMsg = "username successfully copied to your clipboard!";
    let errMsg = "failed to copy to clipboard, please try again";

    navigator.clipboard.writeText(text).then(() => {
        alert(alertMsg);
    }).catch(err => {
        alert(errMsg);
    });
};

class Main {
    constructor() { };
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

var loadingsfx = new Audio("BGM/load.wav");

class webSound {
    constructor() { };
    playSound(id) {
        // for MP3 files
        var SE_Hover = 1;
        var SE_Coin = 2;
        var SE_Load = 3;
        var SE_Finish = 4;
        var SE_Back = 10;
        var SE_Init = 11;
        var SE_Back2 = 12;
        var SE_OldOK = 13;
        var SE_Error = 14;
        let SE = new Audio('sound/' + id + '.mp3');
        if (id == "tick") {
            SE.play();
            SE.loop=true;
        } else {
            SE.play();
        }
    }
    playBGM(path) {
        let bgmPath = path
        let bgm = new Audio(bgmPath);

        bgm.play();
        bgm.loop = true;
        bgm.currentTime = 0;
    }
    stopBGM() {
        let bgmPath = '/sound/bgm.mp3';
        let bgm = new Audio(bgmPath);

        bgm.pause();
    }
    playStartupSound() {
        let sndPath = '/sound/startup.wav';
        let snd = new Audio(sndPath);

        snd.play();
        snd.loop = false;
    };
    playSE(id) {
        // for WAV files
        var SE_Hover = 1;
        var SE_Coin = 2;
        var SE_Load = 3;
        var SE_Finish = 4;
        var SE_Back = 10;
        var SE_Init = 11;
        var SE_Back2 = 12;
        var SE_OldOK = 13;
        var SE_Error = 14;

        let SE = new Audio('/sound/' + id + '.wav');
        SE.play();
    }
    Load() {
        document.getElementById("loadicon").style.display = "block";
        setInterval(() => { this.stopLoad(); }, 5000);
        loadingsfx.play();
        loadingsfx.loop = true;
        loadingsfx.currentTime = 0;
    }
    stopLoad() {
        document.getElementById("loadicon").style.display = "none";
        loadingsfx.pause();
    }
    playDSCameraTutorialBGM() {
        const audio = document.getElementById('DSiCamTutElem');
        if (audio) {
            audio.play();
            audio.loop = true;
        } else { console.error('no element') }
    }
    playDSIMenuBGM() {
        const aud = document.getElementById("DSMenuElem");
        aud.play();
        aud.loop = true;
    }
    play3DSInvalidBannerSND() {
        let aud = new Audio("/BGM/3dsinvalidBanner.mp3");
        aud.play();
        aud.loop = true;
    }
    play3DSLockedBannerSND() {
        let aud = new Audio("/BGM/3dslockedBanner.mp3");
        aud.play();
        aud.loop = true;
    }
}

function jumpTo(item, type = "url") {
    if (type == "url") {
        snd.playSE(15);
        snd.Load();
        setTimeout(() => {
            window.location.href = item;
        }, 550)
    } else if (type == "reload" && item == null) {
        snd.playSE(15);
        snd.Load();
        setTimeout(() => {
            window.location.reload();
        }, 550)
    } else if (type == null && item == "showBack") {
        snd.playSE(10);
        snd.Load();
        setTimeout(() => {
            const prev = document.referrer;
            if (prev) {
                history.back();
            } else {
                window.location.href = '/';
            }
        }, 550);
    } else if (type == null && item == "showIndex") {
        snd.playSE(10);
        snd.Load();
        setTimeout(() => {
            window.location.href = '/';
        }, 550);
    } else if (type == "successBtn") {
        snd.playSE(13);
        snd.Load();
        setTimeout(() => {
            window.location.href = item;
        }, 550);
    }
}

function getFormattedDate() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return month + day;
}

function getMusic() {
    const date = getFormattedDate();

    if (date === "0401") {
        return "/BGM/Secret.mp3";
    }

    switch (date) {
        case "0327":
            return "/BGM/eshop2011.wav";
        case "0130":
            return "/BGM/wsc.mp3";
        case "0727":
            return "/BGM/ww.mp3";
        case "0331":
            return "/BGM/dsshop.mp3";
        default:
            return "/BGM/bgm.mp3";
    }
}

function dispMsg() {
    const date = getFormattedDate();
    const yr = new Date().getFullYear().toString().slice(-2);
    const constelems = "<br/><br/>";
    let msg = "";

    switch (date) {
        case "0327":
            msg = constelems + (yr - 23) + " years have passed since the 3DS/Wii U eShop shutdown.";
            break;
        case "0401":
            msg = constelems + "Happy April Fools!...";
            break;
        case "0130":
            msg = constelems + (yr - 19) + " years have passed since the Wii Shop Channel shutdown.";
            break;
        case "0331":
            msg = constelems + (yr - 17) + " years have passed since the DSi Shop shutdown.";
            break;
    }

    document.getElementById("Obj").innerHTML = msg;
}

let Music = getMusic();

const cro = new URLSearchParams(window.location.search).has('cro');

let bgmPath = getMusic();
let bgm = new Audio(bgmPath);

function playBGM() {
    let elem = document.getElementById("shopbgmselector");
    document.getElementById("shopbgm").innerHTML = "pause BGM";
    let savetime = localStorage.getItem("bgmlooppoint");

    elem.href = "javascript:pauseBGM()";
    bgm.volume = 0.6;
    bgm.loop = true;

    bgm.play().then(() => {
        if (savetime) {
            bgm.currentTime = parseFloat(savetime);
        }
    });
}

function pauseBGM() {
    localStorage.setItem("bgmlooppoint", bgm.currentTime);
    bgm.pause();
    document.getElementById("shopbgmselector").href = "javascript:playBGM();";
    document.getElementById("shopbgm").innerHTML = "play BGM";
}

window.onbeforeunload = function () {
    localStorage.setItem("bgmlooppoint", bgm.currentTime);
};


function initFavicon(PATH, frames, interval) {
    let uacheck = navigator.userAgent.toLowerCase().includes("firefox");
    let ico = document.querySelector("link[rel='icon']") || document.createElement("link");
    ico.rel = "icon";
    ico.type = "image/x-icon"

    if (!uacheck) {
        var i = 0;
        setInterval(() => {
            ico.href = `${PATH}frame_${i % frames}.png`;
            i++;
        }, interval);
    } else {
        ico.href = "/images/favicon_ani.gif";
        ico.type = "image/gif";
    }

    document.head.appendChild(ico);
}