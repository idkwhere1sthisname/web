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

function getFormattedDate() {
    const date = new Date();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return month + day;
}

function initClock() {
    function checkTime(i) {
        return i < 10 ? "0" + i : i;
    }

    function startClockcmn() {
        var el = document.getElementById("clockTextPlaceholder");
        if (el) {
            el.style.color = "turquoise";
            el.style.fontWeight = "bold";
            const t = new Date();
            const opt = {
                timeZone: "Europe/Rome",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            };
            const formatter = new Intl.DateTimeFormat("en-GB", opt);
            el.innerHTML = formatter.format(t);
            setTimeout(initClock, 1000);
        }
    }

    startClockcmn();
}

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

function showSects(show, hide) {
    document.getElementById(show).style.display = "block";
    document.getElementById(hide).style.display = "none";
    
    history.replaceState(null, null, window.location.pathname + window.location.search);
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


function jumpTo(url) { window.location.href=url; }

function showMarquee() { document.getElementById("mq").style.display = ''; }
function exitMarquee() { document.getElementById("mq").style.display = 'none'; }

// offline stuff

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/serviceworker.js')
      .then(reg => console.log('service worker: successfully registered\n', reg.scope))
      .catch(err => console.error('service worker: registration has failed :(\n', err));
  });
}
