// common offsets
// everything is from WiiBrew: https://wiibrew.org/wiki/Title_metadata
const SIGN_TYPE         = 0x0000
const SIGNATURE         = 0x0004
const PADDING_00        = 0x0104

const ISSUER            = 0x0140
const ISSUER_LEN        = 0x0040
const VERSION           = 0x0180
const CA_CRL_VER        = 0x0181
const SIGNER_CRL_VER    = 0x0182
const IS_COMPAT         = 0x0183
const SYS_VERSION       = 0x0184
const TITLE_ID          = 0x018C
const TITLE_TYPE        = 0x0194
const GROUP_ID          = 0x0198
const PADDING_01        = 0x019A
const REGION            = 0x019C
const RATING            = 0x019E
const RESERVED          = 0x01AE
const ACCESS_RIGHT      = 0x01D8
const TITLE_VERSION     = 0x01DC
const CONTENTID_NUM     = 0x01DE
const BOOT_IDX          = 0x01E0
const TITLE_VERSION_MIN = 0x01E2
// contentId
const CID__START        = 0x01E4
const CID__LEN          = 0x0004
const CID__IDX          = 0x0002
const CID__TYPE         = 0x0002
const CID__SIZE         = 0x0008
const CID__HASH         = 0x0020

function checkForTMDs() {
    document.getElementById("theForm").addEventListener('change', async (evt) => {
        const tmdIn = evt.target.files[0];
        if (!tmdIn) return;
        try {
            const bfr = await tmdIn.arrayBuffer();
            const tmddat = parseTMD(bfr);
            const objs = [
                { id: "signType",          label: "signature type",         value: tmddat.signType },
                { id: "version",           label: "TMD version",            value: tmddat.verison },
                { id: "issuer",            label: "issuer",                 value: tmddat.issuer },
                { id: "caCrlVersion",      label: "CA CRL version",         value: tmddat.caCrlVer },
                { id: "signerCrlVer",      label: "signer CRL version",     value: tmddat.signerCrlVer },
                { id: "isCompat",          label: "vWii",                   value: tmddat.isCompat },
                { id: "titleId",           label: "title ID",               value: tmddat.titleId },
                { id: "titleType",         label: "title type",             value: tmddat.titleType },
                { id: "groupId",           label: "group ID",               value: tmddat.groupId },
                { id: "region",            label: "region",                 value: tmddat.region },
                { id: "accessRight",       label: "access rights",          value: tmddat.accessRight },
                { id: "titleVersion",      label: "title version",          value: tmddat.titleVersion },
                { id: "contentIdNum",      label: "number of contents",     value: tmddat.contentIdNum },
                { id: "bootIdx",           label: "boot index",             value: tmddat.bootIdx },
                { id: "titleVersionMin",   label: "title version (minor)",  value: tmddat.titleVersionMin }
            ];
            renderATmd(objs,tmddat.contents);
        } catch (e) {
            console.error("Errore durante l'elaborazione del file TMD:", e);
        }
    });
}

function getATmd(bfr,off,len) {
  if (off+len>bfr.byteLength) len = bfr.byteLength-off;
  if (len<=0) return "offset out of bounds";
  const byteArray = new Uint8Array(bfr,off,len);
  return Array.from(byteArray).map(byte=>byte.toString(16).padStart(2,'0')).join(' ');
}

function parseTMD(bfr) {
    const view = new DataView(bfr);
    const decoder = new TextDecoder('utf-8');
    const tmdInfo = {}
    const toHexStr=(num,bytelen)=>"0x"+num.toString(16).padStart(bytelen*2,'0').toUpperCase();
    const toHexStrBigInt=(bigInt,bytelen)=>"0x"+bigInt.toString(16).padStart(bytelen*2,'0').toUpperCase();
    tmdInfo.signType = toHexStr(view.getUint32(SIGN_TYPE,false));
    tmdInfo.version = toHexStr(view.getUint8(ISSUER,false));
    const issuerBytes = new Uint8Array(bfr,ISSUER,ISSUER_LEN);
    tmdInfo.issuer = decoder.decode(issuerBytes).replace(/\0+$/,'');
    tmdInfo.caCrlVer = toHexStr(view.getUint8(CA_CRL_VER));
    tmdInfo.signerCrlVer = toHexStr(view.getUint8(SIGNER_CRL_VER));
    tmdInfo.isCompat = toHexStr(view.getUint8(IS_COMPAT));
    tmdInfo.sysVersion = toHexStr(view.getBigUint64(SYS_VERSION,false).toString(16));
    tmdInfo.titleId = toHexStr(getATmd(bfr,TITLE_ID,8).replace(/\s/g,'')); 
    tmdInfo.titleType = toHexStr(view.getUint32(TITLE_TYPE,false));
    tmdInfo.groupId = toHexStr(view.getUint16(GROUP_ID,false));
    tmdInfo.region = toHexStr(view.getUint16(REGION,false));
    tmdInfo.accessRight = toHexStr(view.getUint32(ACCESS_RIGHT,false));
    tmdInfo.titleVersion = toHexStr(view.getUint16(TITLE_VERSION,false));
    tmdInfo.contentIdNum = toHexStr(view.getUint16(CONTENTID_NUM,false));
    tmdInfo.bootIdx = toHexStr(view.getUint16(BOOT_IDX,false));
    tmdInfo.titleVersionMin = toHexStr(view.getUint16(TITLE_VERSION_MIN,false));
    tmdInfo.contents = [];
    const recordLen = CID__LEN+CID__IDX+CID__TYPE+CID__SIZE+CID__HASH; 
    let CID__off = CID__START;
    for (let i = 0; i<tmdInfo.contentIdNum; i++) {
        if (CID__off+recordLen>bfr.byteLength) break;
        const contentRecord = {
            id: toHexStr(view.getUint32(CID__off,false)),
            index: toHexStr(view.getUint16(CID__off+CID__LEN,false)),
            type: toHexStr(view.getUint16(CID__off+CID__LEN + CID__IDX,false)),
            size: toHexStr(view.getBigUint64(CID__off+CID__LEN+CID__IDX+CID__TYPE,false)).toString(),
            hash: toHexStr(getATmd(bfr,CID__off+CID__LEN+CID__IDX+CID__TYPE+CID__SIZE,CID__HASH).replace(/\s/g, ''))
        };
        tmdInfo.contents.push(contentRecord);
        CID__off += recordLen; 
    }
    return tmdInfo;
}

function renderATmd(TMDInfoArray,contentsArray) {
    for (var i = 0; i<TMDInfoArray.length; i++) {
        var item = TMDInfoArray[i];
        var e = document.getElementById(item.id);
        if (e) {
            e.innerText = item.label+": "+(item.value||"-");
        }
    }
    const tbody = document.getElementById("contentss");
    if (tbody) {
        tbody.innerHTML = "";
        contentsArray.forEach(content => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td style="font-family:monospace;font-size:14px" align="center" valign="middle">${content.index}</td>
                <td style="font-family:monospace;font-size:14px" align="center" valign="middle">${content.id}</td>
                <td style="font-family:monospace;font-size:14px" align="center" valign="middle">${content.type}</td>
                <td style="font-family:monospace;font-size:14px" align="center" valign="middle">${content.size}</td>
                <td style="font-family:monospace;font-size:14px" align="center" valign="middle">${content.hash}</td>
            `;
            tbody.appendChild(row);
        });
    }
    document.getElementById('tmdDATADONOTDELETE').style.display = '';
}
