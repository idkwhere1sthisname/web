function playrevsnd(path,vol=1) {
    var aud = new Audio("/misc/revivals/SND/"+path);
    aud.volume = vol;
    aud.loop=false;
    aud.play();
}