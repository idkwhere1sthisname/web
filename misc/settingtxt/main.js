// from http://www.hacksden.com/downloads.php?do=file&id=135, https://github.com/GaryOderNichts/vWii-Decaffeinator/blob/master/src/utils/setting_generator.c
// rewritten in js by idkwhereisthisname

function scrypt(bfr, isEnc) {
    let key = 0x73B5DBFA;
    const u8 = new Uint8Array(bfr.length);
    const len = isEnc ? 256 : bfr.length;

    for (let i = 0; i < len; i++) {
        u8[i] = bfr[i] ^ (key & 0xFF);
        key = ((key << 1) | (key >>> 31)) >>> 0;
    }
    
    return u8;
}

//----

function dlfile(isEnc) {
    const input = document.getElementById("settingtxt");
    const file = input.files[0];
    if (!file) return alert("please select a file.");

    const rdr = new FileReader();
    rdr.onload = function (e) {
        const bfr = new Uint8Array(e.target.result);
        const file = scrypt(bfr, isEnc);
        
        // keep binary mime to not mess up anything
        const b = new Blob([file], { type: "application/octet-stream" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(b);
        link.download = isEnc ? "setting_enc.txt" : "setting_dec.txt";
        link.click();
    };

    rdr.readAsArrayBuffer(file);
}

function parseSetting() {
    const input = document.getElementById("settingtxt");
    const file = input.files[0];
    const ins0101 = document.getElementById("instruction01_01");
    ins0101 != null ? ins0101.remove() : "";

    if (!file) return alert("please select a .txt file.");

    const rdr = new FileReader();
    rdr.onload = function (e) {
        let bfr = new Uint8Array(e.target.result);
        let text = new TextDecoder("utf-8", { fatal: false }).decode(bfr);

        const is_enc = /^(AREA|MODEL|DVD|SERNO|VIDEO|GAME)=/m.test(text);

        if (!is_enc) {
            bfr = scrypt(bfr, false);
            text = new TextDecoder("utf-8", { fatal: false }).decode(bfr);
        }

        const lines = text.split(/\r?\n/);
        const settingfields = {};
        const notefield = [];

        for (const line of lines) {
            const match = line.match(/^(\w+)=([^\n\r]*)$/);
            if (match) {
                const [, key, value] = match;
                settingfields[key] = value;

                if (key === "MODEL" && value.includes("RVT")) {
                    notefield.push("<code>MODEL</code> field is intended for <a href=\"https://wiibrew.org/wiki/Revolution_Arcade\" title=\"Revolution Arcade\">RVA</a> units.");
                }
                if (key === "DVD" && value === "1") {
                    notefield.push("<CODE>DVD</CODE> is set to <code>1</code>.");
                }
                if (key === "SERNO" && value === "98765432") {
                    notefield.push("<CODE>SERNO</CODE> matches <a href=\"https://wiibrew.org/wiki/Revolution_Arcade\" title=\"Revolution Arcade\">RVA</a> serial: 98765432.");
                }
            }
        }

        const setting_HTMLinner = Object.entries(settingfields)
            .map(([key, value]) => `<div><strong>${key}</strong>: ${value}</div>`)
            .join('');

        const note_HTMLinner = notefield.length
            ? `<div style="margin-top:10px;color:red;"><strong>NOTE(s):</strong><br>${notefield.join("<br>")}</div>`
            : "";

        document.getElementById("parse").innerHTML = setting_HTMLinner + note_HTMLinner;
    };

    rdr.readAsArrayBuffer(file);
}
