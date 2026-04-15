// https://codepen.io/alvarotrigo/pen/ZEJgqLN
var words = [
  'fav. consoles: Wii, New3DSXL, Wii U',
  'pronouns: he/they',
  'fav. games: Minecraft (java), Deltarune'
],
    part,
    i = 0,
    offset = 0,
    len = words.length,
    forwards = true,
    skip_count = 0,
    skip_delay = 50,
    speed = 40;
var wordflick = function () {
  setInterval(function () {
    if (!words.length) return;
    if (!words[i]) i = 0;
    if (forwards) {
      if (offset >= words[i].length) {
        ++skip_count;
        if (skip_count == skip_delay) {
          forwards = false;
          skip_count = 0;
        }
      }
    } else {
      if (offset == 0) {
        forwards = true;
        i = (i + 1) % len;
        offset = 1;
      }
    }
    part = words[i].substr(0, offset);
    if (skip_count == 0) {
      offset += forwards ? 1 : -1;
    }
    $('.word').text(part);
  },speed);
};
$(document).ready(function () {
  wordflick();
});