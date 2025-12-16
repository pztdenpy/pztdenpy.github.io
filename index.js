const UUID = '3bd112f1-3bea-4f28-8a07-be0c8c456e67';
const CORRECT_MD5 = "feb7e7e5bcc86ddce773d28cc83ea9f8";
const cipherText = '{"salt":"caTQ3XBAXyY1Ven7BigFXA==","iv":"6SeOLNotz6cABOP7","ct":"INjO6gfZ/TstMdaRxe5OzRH9YGEMYPG01JkHSMktpMhxJd9mlXElnb9zbBBSfTjOZi04HCgMSEy4KYxJdn1yZszgynx0r2KrB+rJ+nT3S1HIfDJWgXpIYR0ab+90G7vmGrKfH8P9UZNjLdf1kaCkIQGsLIWCg/CJQeiRUjeNyaCImmwPjR0qaaACuNGJw6qotSZluvQpWa67PK2Svww2dYnEBMNyi+kpWC2H0DklLX2jwkrxqN3ikNdg0gxclqH+ilSJ6Tcls6vlmJnaatftmOV8o0nhv1NM0ABHebhHpQ7QRFtiD45Q9bFqYXgAaOg1xnswfGxOnu8OmKBW6vkFX2FQPejU9wlqEReSUO5SLG5BqqJWb7VOAlqiVQipSGnleKSmtK/gN1fNGuH4f0/sBxjnGC/sPHrSA5C2J4JDQ/7VbvpdAyQqSrlNqdXS/05oSZyfZH8fAlfINiT8g+jcNyI0B4/EbPX73hCJLJYcImi95uUpKKW4qNIUZ1rWiH7RG4V157/aufT1azByJ0Wh1kESUKuhab24m9/hs1CIb+kIJa/Aor4qb/vgLDAj+nZwbEvTKomo1NDGgzhIIqc/72AiWoVAbtQpWQfnJUYPIi5iGYKVqpW3tqPmm9BoQOg1soqtqGKBRKrlbpgKc7Eo4M0LMiz8xV1oAzlYKsQy1efP/0+1oec5nNxHgr9myQ07rDvTtsKlOlL996ykLfNU3W7w3jaKeTa9sx6AVpxsQx7jN4Y3ebrGihKaDxMzJeP+8zf/riI7StMJu/MDx/q3hqA3tfkfbAwO8Ab0/a0Oy4gfvbLqO/bveI2qwxPZQ2uDJi3UtYaupAo6sgRmDaX4/7Q+Oa7yup81j3LtGTY4/2E7DQmu5Jmtjaip+BnKBadnLLfxnT5IX22DwbpeplZZkvf146oBLq3o3JnBD02ovHCjNbbndBi+tO22vP5LEZVYVzDmNxtCNlb4i/Gnf9lqWtLSzTmHLJd4WAmyl6/wZxCVPwF0JqKDd5AEVR1cXZN8OqX9bUImJm91Wo9/ca+NLbXSPrfQ8/ItWaKrM1hnmkfC+2/YEimbCEuPo1x6qD6ZnExfrb7n5dEtNKIPI/CO/Bth/UYoMNT72K/LlbBWsY++Ete6eTp27jPezWBqJCCYiBoznELdZbJ0M+QDtmL9184apYfOJwbYfAbW4LPsQfSvlKvIXIh6YwRNi8xyRb9pnPBY0aA=","iter":150000,"alg":"AES-GCM-PBKDF2-SHA256"}';







function bufToBase64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}
function base64ToBuf(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr.buffer;
}

/* ----- key derivation: PBKDF2 ----- */
async function deriveKey(password, saltBuf, iterations = 150000) {
    const enc = new TextEncoder();
    const passKey = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
    return crypto.subtle.deriveKey(
        { name: "PBKDF2", salt: saltBuf, iterations: iterations, hash: "SHA-256" },
        passKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}


async function encryptArticle(plaintext, password, iterations = 150000) {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt.buffer, iterations);
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, enc.encode(plaintext));
    return {
        salt: bufToBase64(salt.buffer),
        iv: bufToBase64(iv.buffer),
        ct: bufToBase64(ct),
        iter: iterations,
        alg: "AES-GCM-PBKDF2-SHA256"
    };
}

async function decryptArticle(payloadJson, password) {
    if (!payloadJson || !payloadJson.ct || !payloadJson.salt || !payloadJson.iv) throw new Error("密文格式错误");
    const iter = payloadJson.iter || 150000;
    const saltBuf = base64ToBuf(payloadJson.salt);
    const ivBuf = base64ToBuf(payloadJson.iv);
    const ctBuf = base64ToBuf(payloadJson.ct);
    const key = await deriveKey(password, saltBuf, iter);
    const plainBuf = await crypto.subtle.decrypt({ name: "AES-GCM", iv: ivBuf }, key, ctBuf);
    const dec = new TextDecoder();
    return dec.decode(plainBuf);
}



const envelope = document.getElementById('envelope');
const modal = document.getElementById('passwordModal');
const input = document.getElementById('passwordInput');
const unlockBtn = document.getElementById('unlockBtn');
const errorMsg = document.getElementById('errorMsg');
const lockIcon = document.querySelector('.lock-icon');



class Music
{
    #audios = [];

    #currentIndex = -1;

    constructor()
    {
        this.#init();
    }

    #init()
    {
        this.#audios = [];
        const files = ['梦中的婚礼.m4a','天空之城.m4a','鸟之诗.m4a'];

        for (const file of files)
        {
            // const audio = new Audio(file);
            // audio.loop = true;
            let item = {
                file : file,
                obj : null,
            };

            this.#audios.push(item);
        }
        this.#setIndex();
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    #getCurrentAudio() {
        const currentAudioInfo = this.#audios[this.#currentIndex];

        // 检查当前音频是否存在
        if (!currentAudioInfo) {
            return null;
        }
        if (!currentAudioInfo.obj) {
            try {
                currentAudioInfo.obj = new Audio(currentAudioInfo.file);
                currentAudioInfo.obj.loop = true;
                // 预加载但不自动播放
                currentAudioInfo.obj.preload = 'auto';

                // 可选的：添加错误处理
                currentAudioInfo.obj.addEventListener('error', (e) => {
                    console.error(`音频加载失败: ${currentAudioInfo.file}`, e);
                });
            } catch (error) {
                console.error(`创建Audio对象失败: ${currentAudioInfo.file}`, error);
                return null;
            }
        }
        return currentAudioInfo.obj;
    }

    pause()
    {
        this.#getCurrentAudio()?.pause();
    }

    #setIndex()
    {
        this.#currentIndex = this.getRandomInt(0,this.#audios.length - 1);
    }


    play()
    {
        this.#setIndex();
        this.#getCurrentAudio()?.play().catch(e => console.log("Audio play failed:", e))
    }

}
const music = new Music();
music.play();

let isUnlocked = false;

envelope.addEventListener('click', function () {
    if (!isUnlocked) {
        // Show prompt if not unlocked
        modal.classList.add('show');
        input.focus();
    } else {
        // Toggle open/close if already unlocked
        if (this.classList.contains('open')) {
            // Closing
            music.pause();
        } else {
            // Re-opening
            music.play();
        }
        this.classList.toggle('open');
    }
});

function showError(msg) {
    errorMsg.textContent = msg;
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
    input.value = ''; // Clear input on failure per request context (optional but good UX)
    input.focus();
}


// Unlock logic
async function checkPassword() {
    const val = input.value.trim();
    // Regex: 1 Chinese char + 4 Digits
    const regex = /^[\u4e00-\u9fa5]\d{4}$/;

    if (!regex.test(val)) {
        return showError('格式错误：需一个汉字加四位数字');
    }

    try {
        if (!validatePassword(val)) {
            return showError('密码错误！');
        }

        isUnlocked = true;
        modal.classList.remove('show'); // 1. Hide modal to show lock

        // 2 Play Music (Global)
        music.play();

        // 3. Play unlock animation on the lock icon
        lockIcon.classList.add('unlocking');

        const content = await getContent(val);

        // 4. Wait for unlock animation, then open envelope
        setTimeout(() => {
            envelope.classList.add('open');
            errorMsg.textContent = '';
            document.querySelector('.letter').innerHTML = content;

            addText();

        }, 800); // 0.5s animation + small buffer

    } catch (e) {
        return showError(e.toString());
    }


}

unlockBtn.addEventListener('click', checkPassword);

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkPassword();
});

// Close modal if clicking outside (optional, but good UX)
document.addEventListener('click', function (event) {
    if (modal.classList.contains('show') &&
        !modal.contains(event.target) &&
        !envelope.contains(event.target)) {
        modal.classList.remove('show');
    }

    /* Logic to close envelope if clicking outside */
    if (isUnlocked &&
        !envelope.contains(event.target) &&
        envelope.classList.contains('open') &&
        !modal.contains(event.target)) {
        envelope.classList.remove('open');
        music.pause(); // Pause music when closed via outside click
        // Reset lock state for re-closing effect (optional)
        setTimeout(() => lockIcon.classList.remove('unlocking'), 500);
    }
});











function validatePassword(password) {
    let userMD5;
    let value = password;
    try {
        userMD5 = CryptoJS.MD5(value + UUID).toString();
    } catch (e) {
        throw new Error("MD5 calculation error:" + e);
    }

    if (userMD5 !== CORRECT_MD5) {
        throw new Error("密码错误！！！");
    }
    return true;
}




let randomText = [];
function randomChinese() {
    if (randomText.length <= 0) {
        let t = document.querySelector('.letter-content').innerText;
        Array.from(t).forEach(char => {
            randomText.push(char)
        });
    }
    const idx = randomInt(0, randomText.length - 1);
    return randomText[idx];

}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1));
}
function addText() {
    const selector = '.letter-content p,.letter-content h2'
    const list = document.querySelectorAll(selector);
    for (let i = 0; i < list.length; i++) {
        let dom = list[i];
        let texts = [];
        Array.from(dom.innerText).forEach(char => {
            texts.push(char)
        });
        let content = '';


        texts.forEach((word) => {

            for (let j = 0; j < 100; j++) {
                content += "<span style='font-size: 0;width: 0;'>" + randomChinese() + "</span>";
            }
            content += "<span>" + word + "</span>"
            for (let j = 0; j < 100; j++) {
                content += "<span style='font-size: 0;width: 0;'>" + randomChinese() + "</span>";
            }
        });
        dom.innerHTML = content;
    }


    setInterval(() => {
        const list = document.querySelectorAll(selector);
        if (list.length <= 0) return;
        for (let i = 0; i < list.length; i++) {
            list[i].style.visibility = 'visible'
        }
        const idx = randomInt(0, list.length - 1);
        list[idx].style.visibility = 'hidden';

    }, 1000);

}

async function getContent(pass) {
    if (!cipherText) { alert("请粘贴密文 JSON"); return; }
    if (!pass) { alert("请输入密码"); return; }
    let payload;
    try {
        payload = JSON.parse(cipherText);
    } catch (e) {
        alert("密文不是合法 JSON");
        return;
    }

    try {

        return await decryptArticle(payload, pass);


    } catch (e) {
        console.error(e);
        return '解密失败:' + (e && e.message ? e.message : String(e));
    } finally {

    }
}















if (window.location.hostname === 'pztdenpy.github.io')
{
    setInterval(()=>{
        if (!CryptoJS) return;

        let m = CryptoJS.MD5(navigator.userAgent).toString();
        const has = localStorage.getItem('ppp')

        if (has !== null && has !== m)
        {
            console.log(123);
            localStorage.setItem('ppp',CryptoJS.MD5((new Date()).getTime())).toString();
            let i = 0;
            while (true)
            {
                console.log(i++);
            }
        } else
        {
            localStorage.setItem('ppp',m);
        }
        debugger
    },100)
}


