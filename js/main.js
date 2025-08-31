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


function jumpTo(url) { window.location.href = url; }

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

// don't call twice
function KTV_ShowAlert(
        dialogtext,
        okbtntext,
        okbtnaction,
        okbtnhref,
        showtransparentgradient = true,
        soundtype = "KTV_SND_PACK",
        mimicogch = true,
        dialogclassname = ".ktvdialog_container",
        gradientclassname = '.gradientforktvdialog',
    ) {
    var $dialog = $(dialogclassname);
    var $overlay = $(gradientclassname);
    var dialogSnd = document.getElementById("dialogsnd");
    var dialog_inner = document.getElementsByClassName("ktvdialog_text")[0];
    var okbtn_inner = document.getElementById("ktvdialog_innertext");
    var okbtn_cnt = document.getElementsByClassName("ktvdialog_button")[0];

    if ($dialog == null || $overlay == null) {
        return undefined;
    }

    if (dialog_inner == undefined || okbtn_inner == undefined || okbtn_cnt == undefined) {
        return undefined;
    }

    if (soundtype == "FLASHPLAYERSE") {
        mimicogch = false;
    }

    dialog_inner.innerHTML = dialogtext;
    okbtn_inner.innerHTML = okbtntext;
    document.querySelector('.ktvdialog_button').setAttribute("href", okbtnhref);
    okbtn_cnt.style.display = "block";
    $dialog.show();
    $overlay.show();

    if (showtransparentgradient) {
        $overlay.addClass('transparentgradient_ktv');
    } else {
        $overlay.removeClass('transparentgradient_ktv')
    }

    if (soundtype == "KTV_SND_PACK") {
        dialogSnd = document.getElementById("popup_ktv");
    } else if (soundtype == "FLASHPLAYERSE") {
        dialogSnd = document.getElementById("dialogsnd");    
    }


    $overlay.fadeIn(300, function () {
        if (dialogSnd != null) {
            dialogSnd.play();
        }
        $dialog.css('transform', 'translate(-50%, -50%)');
    });

    function doAction() {
        var $dialog = $(dialogclassname);
        var $overlay = $(gradientclassname);

        $dialog.css('transform', 'translate(-50%, -150%)');
        if (soundtype == "KTV_SND_PACK") {
            document.getElementById("selsnd_ktv").play();
        } else if (soundtype == "FLASHPLAYERSE") {
            document.getElementById("selsnd").play();
        }

        setTimeout(function () {
            $dialog.hide();
            $overlay.fadeOut(600);

            window.location.href = okbtnaction;
        }, 600);
    }

    $('.ktvdialog_button').off('click').on('click', function (e) {
        e.preventDefault();
        var aud = null;
        if (soundtype == "KTV_SND_PACK") {
            var aud02 = document.getElementById("popup_ktv_exit");

            aud = document.getElementById("selsnd_ktv");
            aud.currentTime = 0;
            aud.loop=false;
            aud.play();

            if (mimicogch) {
                // KTV_POPUP_EXIT
                aud02.currentTime=0;
                aud02.loop=false;
                setTimeout(() => {
                    aud02.play();
                }, 50);
            }
        } else if (soundtype == "FLASHPLAYERSE") {
            aud = document.getElementById("selsnd");
            aud.currentTime=0;
            aud.loop=false;
            aud.play();
        }
        doAction();
    });

    $('.ktvdialog_button').off('mouseover').on('mouseover', function(e) {
        e.preventDefault();
        var audio = null;
        if (soundtype == "KTV_SND_PACK") {
            if (!mimicogch) {
                var audio = null;
            } else {
                var audio = document.getElementById("hvrsnd_ktv");
                audio.loop=false;
                audio.currentTime=0;
                audio.play();
            }
        } else if (soundtype == "FLASHPLAYERSE") {
            audio = document.getElementById("hvrsnd");
            audio.loop=false;
            audio.currentTime = 0;
            audio.play();
        }
    })
    return "OK";
}

function KTV_ShowPersistentAlert(
        dialogtext,
        showtransparentgradient = true,
        soundtype = "KTV_SND_PACK",
        mimicogch = true,
        dialogclassname = ".ktvdialog_container",
        gradientclassname = '.gradientforktvdialog',
    ) {
    var $dialog = $(dialogclassname);
    var $overlay = $(gradientclassname);
    var dialogSnd = document.getElementById("dialogsnd");
    var dialog_inner = document.getElementsByClassName("ktvdialog_text")[0];
    var okbtn_inner = document.getElementById("ktvdialog_innertext");
    var okbtn_cnt = document.getElementsByClassName("ktvdialog_button")[0];

    if ($dialog == null || $overlay == null) {
        return undefined;
    }

    if (dialog_inner == undefined || okbtn_inner == undefined || okbtn_cnt == undefined) {
        return undefined;
    }

    if (soundtype == "FLASHPLAYERSE") {
        mimicogch = false;
    }

    dialog_inner.innerHTML = dialogtext;
    okbtn_cnt.style.display = "block";
    $dialog.show();
    $overlay.show();
    okbtn_cnt.style.display = "none";

    if (showtransparentgradient) {
        $overlay.addClass('transparentgradient_ktv');
    } else {
        $overlay.removeClass('transparentgradient_ktv')
    }

    if (soundtype == "KTV_SND_PACK") {
        dialogSnd = document.getElementById("popup_ktv");
    } else if (soundtype == "FLASHPLAYERSE") {
        dialogSnd = document.getElementById("dialogsnd");    
    }


    $overlay.fadeIn(300, function () {
        if (dialogSnd != null) {
            dialogSnd.play();
        }
        $dialog.css('transform', 'translate(-50%, -50%)');
    });

    return "OK";
}
