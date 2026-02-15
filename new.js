const UUID = '3bd112f1-3bea-4f28-8a07-be0c8c456e67';
const CORRECT_MD5 = "feb7e7e5bcc86ddce773d28cc83ea9f8";
const cipherText = '{"salt":"caTQ3XBAXyY1Ven7BigFXA==","iv":"6SeOLNotz6cABOP7","ct":"INjO6gfZ/TstMdaRxe5OzRH9YGEMYPG01JkHSMktpMhxJd9mlXElnb9zbBBSfTjOZi04HCgMSEy4KYxJdn1yZszgynx0r2KrB+rJ+nT3S1HIfDJWgXpIYR0ab+90G7vmGrKfH8P9UZNjLdf1kaCkIQGsLIWCg/CJQeiRUjeNyaCImmwPjR0qaaACuNGJw6qotSZluvQpWa67PK2Svww2dYnEBMNyi+kpWC2H0DklLX2jwkrxqN3ikNdg0gxclqH+ilSJ6Tcls6vlmJnaatftmOV8o0nhv1NM0ABHebhHpQ7QRFtiD45Q9bFqYXgAaOg1xnswfGxOnu8OmKBW6vkFX2FQPejU9wlqEReSUO5SLG5BqqJWb7VOAlqiVQipSGnleKSmtK/gN1fNGuH4f0/sBxjnGC/sPHrSA5C2J4JDQ/7VbvpdAyQqSrlNqdXS/05oSZyfZH8fAlfINiT8g+jcNyI0B4/EbPX73hCJLJYcImi95uUpKKW4qNIUZ1rWiH7RG4V157/aufT1azByJ0Wh1kESUKuhab24m9/hs1CIb+kIJa/Aor4qb/vgLDAj+nZwbEvTKomo1NDGgzhIIqc/72AiWoVAbtQpWQfnJUYPIi5iGYKVqpW3tqPmm9BoQOg1soqtqGKBRKrlbpgKc7Eo4M0LMiz8xV1oAzlYKsQy1efP/0+1oec5nNxHgr9myQ07rDvTtsKlOlL996ykLfNU3W7w3jaKeTa9sx6AVpxsQx7jN4Y3ebrGihKaDxMzJeP+8zf/riI7StMJu/MDx/q3hqA3tfkfbAwO8Ab0/a0Oy4gfvbLqO/bveI2qwxPZQ2uDJi3UtYaupAo6sgRmDaX4/7Q+Oa7yup81j3LtGTY4/2E7DQmu5Jmtjaip+BnKBadnLLfxnT5IX22DwbpeplZZkvf146oBLq3o3JnBD02ovHCjNbbndBi+tO22vP5LEZVYVzDmNxtCNlb4i/Gnf9lqWtLSzTmHLJd4WAmyl6/wZxCVPwF0JqKDd5AEVR1cXZN8OqX9bUImJm91Wo9/ca+NLbXSPrfQ8/ItWaKrM1hnmkfC+2/YEimbCEuPo1x6qD6ZnExfrb7n5dEtNKIPI/CO/Bth/UYoMNT72K/LlbBWsY++Ete6eTp27jPezWBqJCCYiBoznELdZbJ0M+QDtmL9184apYfOJwbYfAbW4LPsQfSvlKvIXIh6YwRNi8xyRb9pnPBY0aA=","iter":150000,"alg":"AES-GCM-PBKDF2-SHA256"}';

let mapText = '{"salt":"al1kJfaGodNq8DCsjzXlbw==","iv":"hAz8DPsVu+U4qrDk","ct":"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","iter":150000,"alg":"AES-GCM-PBKDF2-SHA256"}';

let map = {};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function bufToBase64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuf(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return arr.buffer;
}

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

class Music {
    #audios = [];
    #currentIndex = -1;

    constructor() {
        this.#init();
    }

    #init() {
        this.#audios = [];
        const files = ['梦中的婚礼.m4a', '天空之城.m4a', '鸟之诗.m4a'];

        for (const file of files) {
            let item = {
                file: file,
                obj: null,
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

        if (!currentAudioInfo) {
            return null;
        }
        if (!currentAudioInfo.obj) {
            try {
                currentAudioInfo.obj = new Audio(currentAudioInfo.file);
                currentAudioInfo.obj.loop = true;
                currentAudioInfo.obj.preload = 'auto';

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

    pause() {
        this.#getCurrentAudio()?.pause();
    }

    #setIndex() {
        this.#currentIndex = this.getRandomInt(0, this.#audios.length - 1);
    }

    play() {
        this.#setIndex();
        this.#getCurrentAudio()?.play().catch(e => console.log("Audio play failed:", e));
    }
}

const music = new Music();

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

async function getContent(pass) {
    if (!cipherText) {
        const errorMsg = "请粘贴密文 JSON";
        alert(errorMsg);
        return errorMsg;
    }
    if (!pass) {
        const errorMsg = "请输入密码";
        alert(errorMsg);
        return errorMsg;
    }
    localStorage.setItem(navigator.userAgent, pass);
    let payload;
    let payload1;
    try {
        payload = JSON.parse(cipherText);
        payload1 = JSON.parse(mapText);
    } catch (e) {
        const errorMsg = "密文不是合法 JSON: " + (e && e.message ? e.message : String(e));
        alert(errorMsg);
        return errorMsg;
    }

    try {
        const res = await decryptArticle(payload, pass);
        map = JSON.parse((await decryptArticle(payload1, pass)));
        return res;
    } catch (e) {
        console.error(e);
        const errorMsg = '解密失败: ' + (e && e.message ? e.message : String(e));
        return errorMsg;
    } finally {

    }
}

Vue.component('password-modal-component', {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        errorMessage: {
            type: String,
            default: ''
        }
    },
    template: `
        <div class="password-modal" :class="{ show: show }" id="passwordModal">
            <h3>请输入口令</h3>
            <p style="font-size: 15px;">开启这封特别的信件需要口令<br>(提示：名字第二个字 + 身份证后4位)</p>
            <input type="text" v-model="password" placeholder="例如：福2025" maxlength="5" @keyup.enter="handleSubmit" ref="passwordInput" id="passwordInput">
            <div class="error-msg" id="errorMsg">{{ errorMessage }}</div>
            <button @click="handleSubmit" id="unlockBtn">开启</button>
        </div>
    `,
    data() {
        return {
            password: ''
        };
    },
    methods: {
        handleSubmit() {
            this.$emit('submit', this.password);
            this.password = '';
        }
    },
    watch: {
        show(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                    this.$refs.passwordInput.focus();
                });
            }
        }
    }
});

Vue.component('envelope-component', {
    props: {
        isUnlocked: {
            type: Boolean,
            default: false
        },
        isOpen: {
            type: Boolean,
            default: false
        },
        isUnlocking: {
            type: Boolean,
            default: false
        },
        letterContent: {
            type: String,
            default: ''
        },
        readingTime: {
            type: Number,
            default: 0
        }
    },
    template: `
        <div class="container" :class="{ open: isOpen }" @click="$emit('click')">
            <div class="envelope">
                <div class="flap left"></div>
                <div class="flap right"></div>
                <div class="flap bottom"></div>
                <div class="flap top"></div>
                
                <div class="lock-icon" :class="{ unlocking: isUnlocking }"></div>
                
                <div class="letter">
                    <div class="letter-content" v-html="letterContent"></div>
                    <div class="reading-time">
                        已阅读时间: {{ readingTime }} 秒
                    </div>
                </div>
            </div>
        </div>
    `
});

window.vueApp = new Vue({
    el: '#app',
    data: {
        isUnlocked: false,
        isEnvelopeOpen: false,
        isUnlocking: false,
        showPasswordModal: false,
        errorMessage: '',
        letterContent: '',
        password: '',
        readingTime: 0,
        timerInterval: null
    },
    mounted() {
       
        
        // 从 localStorage 中加载之前保存的阅读时间
        const savedReadingTime = localStorage.getItem('readingTime');
        if (savedReadingTime) {
            this.readingTime = parseInt(savedReadingTime, 10);
        }
        
        const savedPassword = localStorage.getItem(navigator.userAgent);
        if (savedPassword) {
            this.handlePasswordSubmit(savedPassword, false);
        }
    },
    watch: {
        isEnvelopeOpen(newVal) {
            if (newVal) {
                // 信封打开，开始计时
                this.startReadingTimer();
            } else {
                // 信封关闭，停止计时并保存时间
                this.stopReadingTimer();
                this.saveReadingTime();
            }
        }
    },
    methods: {
        handleEnvelopeClick() {
            console.log('handleEnvelopeClick called');
            console.log('isUnlocked:', this.isUnlocked);
            console.log('showPasswordModal before:', this.showPasswordModal);

            if (!this.isUnlocked) {
                this.showPasswordModal = true;
                console.log('showPasswordModal after:', this.showPasswordModal);
            } else {
                if (this.isEnvelopeOpen) {
                    music.pause();
                } else {
                    music.play();
                }
                this.isEnvelopeOpen = !this.isEnvelopeOpen;
            }
        },
        async handlePasswordSubmit(password, open = true) {
            const val = password.trim();
            const regex = /^[\u4e00-\u9fa5]\d{4}$/;

            if (!regex.test(val)) {
                this.errorMessage = '格式错误：需一个汉字加四位数字';
                return;
            }

            try {
                validatePassword(val);

                this.isUnlocking = true;
                this.showPasswordModal = false;

                music.play();

                const content = await getContent(val);

                setTimeout(() => {
                    this.isUnlocked = true;
                    this.isUnlocking = false;

                    if (open) {
                        this.isEnvelopeOpen = true;
                    }

                    this.errorMessage = '';
                    this.letterContent = content;

                    this.addText();
                }, 800);
            } catch (e) {
                this.errorMessage = e.toString();
                this.showPasswordModal = true;
            }
        },
        addText() {
            const selector = '.letter-content p,.letter-content h2';
            const list = document.querySelectorAll(selector);

            for (let i = 0; i < list.length; i++) {
                let dom = list[i];
                let texts = [];
                Array.from(dom.innerText).forEach(char => {
                    texts.push(char);
                });
                let content = '';

                texts.forEach((word) => {
                    content += "<span>" + word + "</span>";
                });
                dom.innerHTML = content;
            }

            const els = document.querySelectorAll('.letter-content span');
            let indexs = Array.from({ length: els.length }, (_, i) => i);

            for (let i = indexs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [indexs[i], indexs[j]] = [indexs[j], indexs[i]];
            }

            this.processText(indexs, els);
        },
        async processText(indexs, els) {
            while (indexs.length > 0) {
                let index = indexs.pop();
                const el = els[index];
                await sleep(1500);
                el.innerText = this.toMars(el.innerText);
            }
        },
        toMars(text) {
            let res = '';
            Array.from(text).forEach(char => {
                if (!map[char]) {
                    res += char;
                    return;
                }
                let arr = map[char];
                res += arr[this.getRandomInt(0, arr.length - 1)];
            });
            return res;
        },
        getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        startReadingTimer() {
            // 清除之前的计时器
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }
            
            let counter = 0;
            // 每秒钟增加阅读时间
            this.timerInterval = setInterval(() => {
                this.readingTime++;
                counter++;
                // 每5秒保存一次阅读时间，确保准确性
                if (counter % 5 === 0) {
                    this.saveReadingTime();
                }
            }, 1000);
        },
        stopReadingTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
                this.timerInterval = null;
            }
        },
        saveReadingTime() {
            // 将阅读时间保存到 localStorage
            localStorage.setItem('readingTime', this.readingTime.toString());
        }
    }
});

document.addEventListener('click', function (event) {
    const app = document.getElementById('app');
    const passwordModal = document.querySelector('.password-modal');
    const container = document.querySelector('.container');
    const overlay = document.querySelector('.overlay');

    if (passwordModal && passwordModal.style.display !== 'none' &&
        !passwordModal.contains(event.target) &&
        !container.contains(event.target)) {
        passwordModal.style.display = 'none';
    }

    const vueApp = window.vueApp;
    if (vueApp && vueApp.isUnlocked &&
        !container.contains(event.target) &&
        vueApp.isEnvelopeOpen &&
        !passwordModal.contains(event.target)) {
        vueApp.isEnvelopeOpen = false;
        music.pause();
    }
});

document.addEventListener('copy', function (e) {
    const selection = window.getSelection().toString();
    if (!selection) return;
    e.preventDefault();
    const marsText = window.vueApp.toMars(selection);
    e.clipboardData.setData('text/plain', marsText);
});
