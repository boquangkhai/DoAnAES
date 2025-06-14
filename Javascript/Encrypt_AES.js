const sBox = 
[
  0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76,
  0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0,
  0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15,
  0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75,
  0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84,
  0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf,
  0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8,
  0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2,
  0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73,
  0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb,
  0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79,
  0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08,
  0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a,
  0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e,
  0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf,
  0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16
];
const Rcon = 
[
    [0x00, 0x00, 0x00, 0x00],
    [0x01, 0x00, 0x00, 0x00],
    [0x02, 0x00, 0x00, 0x00],
    [0x04, 0x00, 0x00, 0x00],
    [0x08, 0x00, 0x00, 0x00],
    [0x10, 0x00, 0x00, 0x00],
    [0x20, 0x00, 0x00, 0x00],
    [0x40, 0x00, 0x00, 0x00],
    [0x80, 0x00, 0x00, 0x00],
    [0x1b, 0x00, 0x00, 0x00],
    [0x36, 0x00, 0x00, 0x00]
];
//Lấy mã ascii của ký tự sau đó chuyển số sang hệ cơ số 16 (hex)
//.padstart => mỗi byte có 2 ký tự VD: A->41
//join => Ghép tất cả lại thành 1 chuỗi liền mạch
function stringToHex(str)
{
    return [...str]
    .map(char => char.charCodeAt(0).toString(16).padStart(2,'0'))
    .join('');
}
//Chia ra từng word
function splitWords(bytes)
 {
    const words = [];
    for (let i = 0; i < bytes.length; i += 4) {
      words.push(bytes.slice(i, i + 4));
    }
    return words;
}
function rotWord(word)
{
    return [word[1],word[2],word[3],word[0]];
}
function subWord(word)
{
    return word.map(b => sBox[b]);
}

function expandKey(keyString) 
{
    if (keyString.length > 16)
        keyString = keyString.substring(0, 16);
    else if (keyString.length < 16)
        keyString = keyString.padEnd(16, 'X');

    const hexArray = stringToHex(keyString).match(/.{1,2}/g).map(h => parseInt(h, 16));
    const words = splitWords(hexArray);

    for (let i = 4; i < 44; i++) {
        let temp = [...words[i - 1]];
        if (i % 4 === 0) {
            temp = rotWord(temp);
            temp = subWord(temp);
            temp = temp.map((b, j) => b ^ Rcon[i / 4][j]);
        }
        const prev = words[i - 4];
        const newWord = temp.map((b, j) => b ^ prev[j]);
        words.push(newWord);
    }

    const roundKeys = [];
    for (let i = 0; i < 44; i += 4) {
        roundKeys.push(words.slice(i, i + 4).flat());
    }

    return roundKeys;
}
 function addRoundKey(state, roundKey) 
{
    return state.map((b, i) => b ^ roundKey[i]);
}
function subBytes(state) 
{
    return state.map(b => sBox[b]);
}

function shiftRows(state) 
{
    const s = [];
    for (let i = 0; i < 4; i++) 
    {
        s[i] = [state[i], state[i + 4], state[i + 8], state[i + 12]];
    }

    for (let r = 1; r < 4; r++) 
    {
        s[r] = s[r].slice(r).concat(s[r].slice(0, r));
    }
    const result = [];
    for (let c = 0; c < 4; c++) 
    {
        for (let r = 0; r < 4; r++) 
        {
            result.push(s[r][c]);
        }
    }
    return result;
}
function mixColumns(state) 
{
    const mix = (a, b, c, d) => [
        gMul(a, 2) ^ gMul(b, 3) ^ c ^ d,
        a ^ gMul(b, 2) ^ gMul(c, 3) ^ d,
        a ^ b ^ gMul(c, 2) ^ gMul(d, 3),
        gMul(a, 3) ^ b ^ c ^ gMul(d, 2),
    ];

    const result = [];
    for (let i = 0; i < 16; i += 4) 
    {
        result.push(...mix(...state.slice(i, i + 4)));
    }
    return result;
}

function gMul(a, b) 
{
    let p = 0;
    for (let i = 0; i < 8; i++) {
    if (b & 1) p ^= a;
    let hiBitSet = a & 0x80;
        a = (a << 1) & 0xFF;
        if (hiBitSet) a ^= 0x1b;
        b >>= 1;
      }
      return p;
}
function toHex(hex)
{
    return hex.toString(16).padStart(2,'0').toUpperCase();
}
function formatWord(word)
{
    return word.map(toHex).map(hex => hex.padEnd(4, ' ')).join('');
}
function encryptAES() 
{
    let key = document.getElementById("key").value;
    let plaintext = document.getElementById("plaintext").value;
    const output = document.getElementById("output");

    //Kiểm tra rỗng    
    message.textContent = "";
    output.textContent = "";
    
    if(!key && !plaintext)
    {
        message.innerHTML = "&#10060; Vui lòng nhập vào cả Key và Plaintext !!";
        return;
    }
    else if(!key)
    {
        message.innerHTML = "&#10060; Vui lòng nhập Key !!";
        return;
    }
    else if(!plaintext)
    {
        message.innerHTML = "&#10060; Vui lòng nhập Plaintext !!";
        return;
    }
    //Lưu lại chuỗi gốc ban đầu vừa nhập vào:
    let originalPlaintext = plaintext;

    if (plaintext.length > 16) 
    {
        plaintext = plaintext.substring(0, 16);
        originalPlaintext = plaintext;
    }
    else if (plaintext.length < 16) 
    {
        // plaintext = plaintext.padEnd(16, 'X');  
        plaintext = plaintext + ' ' + 'X'.repeat(16 - plaintext.length - 1);
        originalPlaintext = plaintext;
    }
    if (key.length > 16) 
        key = key.substring(0, 16);
    else if (key.length < 16) 
        //key = key.padEnd(16, 'X');
        key = key + ' ' + 'X'.repeat(16 - key.length - 1);

    const roundKeys = expandKey(key);
    //Chuyển từ chuỗi nhập sang hex
    let state = stringToHex(plaintext).match(/.{1,2}/g).map(h => parseInt(h, 16));
    //Chuyển key sang hex
    let stateKey = stringToHex(key).match(/.{1,2}/g).map(h => parseInt(h, 16));

    let log = `Khởi tạo: \n`;
    log += `Plaintext String: ${originalPlaintext}\n`;

    //Duyệt và chuyển chuỗi thành từng cụm 2 byte hex ngăn nhau bởi khoảng trắng
    log += `Plaintext (Hex): ${formatWord(state)}\n`;
    log += `Key (String): ${key}\n`; 
    log += `Key (Hex): ${formatWord(stateKey)}\n`;

    state = addRoundKey(state, roundKeys[0]);
    log += `\nAddRoundKey (Round 0): ${formatWord(state)}\n`;

    for (let round = 1; round <= 10; round++) 
    {
        log += `\n<b>-- Round ${round} --</b>\n`;

        state = subBytes(state);
        log += `SubBytes:    ${formatWord(state)}\n`;

        state = shiftRows(state);
        log += `ShiftRows:   ${formatWord(state)}\n`;

        if (round !== 10) 
        {
          state = mixColumns(state);
          log += `MixColumns:  ${formatWord(state)}\n`;
        }

        state = addRoundKey(state, roundKeys[round]);
        log += `AddRoundKey: ${formatWord(state)}\n`;
    }
    const cipherHex = formatWord(state);
    const cipherText = state.map(b => String.fromCharCode(b)).join('');
 
    log += `<br><b>Ciphertext (Hex):</b> ${cipherHex}`;
    log += `<br><b>Ciphertext (String):</b> ${cipherText}`;
    output.innerHTML = log.replace(/\n/g, '<br>');
}