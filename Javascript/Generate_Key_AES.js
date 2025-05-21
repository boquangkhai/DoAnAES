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
function toHex(hex)
{
    return hex.toString(16).padStart(2,'0').toUpperCase();
}
function formatWord(word)
{
    return word.map(toHex).map(hex => hex.padEnd(4, ' ')).join('');
}
function padLabel(label, width = 22) 
{
    return label.padEnd(width, ' ');
}
function onGenerateKey() {
    //Dùng let vì ở đây có sự thay đổi biến, gán lại biến input
    //Dùng const sẽ không được gán lại biến
    let input = document.getElementById("key").value; 
    const output = document.getElementById("output");
    
    message.textContent = "";
    output.textContent = "";
    
    if(input.length === 0)
        message.innerHTML = "&#10060; Vui lòng nhập khóa!!";
    else
    {
        if(input.length > 16)
            input = input.substring(0,16);
        else if(input.length < 16 && input.length > 0)
            //input = input.padEnd(16,'X');
            input = input + ' ' + 'X'.repeat(16 - input.length - 1);
    }
    result = `Chuỗi nhập: ${input}\n`;
    //I. Phần khởi tạo w[0] -> w[3]
    // Bước 1: chuyển sang hex
    const hexString = stringToHex(input);
    const hexArray = hexString.match(/.{1,2}/g); // chia thành mảng 2 ký tự
    result += `Chuyển sang Hex: ${formatWord(hexArray)}\n`;

    // Bước 2: chuyển sang mảng byte
    const byteArray = hexArray.map(h => parseInt(h, 16));

    // Bước 3: chia thành các word
    const words = splitWords(byteArray);
    result += `\nCác Word ban đầu:\n`;
    words.forEach((w, i) => {
        result += `w[${i}] = ${formatWord(w)}\n`;
    });

    result += `\nQuá trình mở rộng khóa:\n`;
    //Mở rộng từ w[4] đến w[43] (tạo 10 round key, mỗi round key có 4 words)
    for (let i = 4; i < 44; i++) 
    {
        let temp = [...words[i - 1]]; // Sao chép word trước đó

        if (i % 4 === 0) {
            const roundNumber = Math.floor(i / 4);
            result += `\n<b>-> i = ${i} (bắt đầu Round ${roundNumber}):</b>\n`;
            result += `<b>Tính g(w[${i-1}]): </b>`;
            result += `\n-> i = ${i} (chia hết cho 4):\n`;

            result += `${padLabel("Trước RotWord:")}  ${formatWord(temp)}\n`;
            temp = rotWord(temp);
            result += `${padLabel("Sau RotWord:")}  ${formatWord(temp)}\n`;

            temp = subWord(temp);
            result += `${padLabel("Sau SubWord:")}  ${formatWord(temp)}\n`;

            const rcon = Rcon[i / 4];
            temp = temp.map((b, j) => b ^ rcon[j]);
            result += `${padLabel("Sau XOR với Rcon:")}  ${formatWord(temp)}\n`;
            result += `${padLabel(`Đây là g(w[${i-1}]):`)}  ${formatWord(temp)}\n`;

            const prevNk = words[i - 4];
            const newWord = temp.map((b,j) => b ^ prevNk[j]);
            words.push(newWord);

            result += `w[${i}] = w[${i - 4}] <b> &#8853; </b> g(w[${i-1}]) = ${formatWord(prevNk)} <b> &#8853; </b> ${formatWord(temp)}\n\n`;
            result += `                         = ${formatWord(newWord)}\n`;
        } 
        else 
        {
            result += `\n-> i = ${i}:\n`;
            const prevWord = words[i - 1];
            const prevNk = words[i - 4];
            const newWord = prevWord.map((b, j) => b ^ prevNk[j]);
            words.push(newWord);
            result += `w[${i}] = w[${i - 1}] <b> &#8853; </b> w[${i - 4}] = ${formatWord(prevWord)} <b> &#8853; </b> ${formatWord(prevNk)}\n\n`;
            result += `                        = ${formatWord(newWord)}\n`;
        }

        //Hiển thị lại toàn bộ theo từng Round đồng thời đánh dấu hightlight
        if ((i + 1) % 4 === 0) {
            const roundNumber = Math.floor(i / 4);
            result += `<span class="round-output">Round ${roundNumber}: </span> \n`;
            result += `<span class="round-output">w[${i - 3}] = ${formatWord(words[i - 3])}</span> \n`;
            result += `<span class="round-output">w[${i - 2}] = ${formatWord(words[i - 2])}</span> \n`;
            result += `<span class="round-output">w[${i - 1}] = ${formatWord(words[i - 1])}</span> \n`;
            result += `<span class="round-output">w[${i}] = ${formatWord(words[i])}</span> \n`;
        }
    }

    output.innerHTML = result.replace(/\n/g, "<br>");
}