import convert from './words.js';

const UUID = '3bd112f1-3bea-4f28-8a07-be0c8c456e67';
const CORRECT_MD5 = "feb7e7e5bcc86ddce773d28cc83ea9f8";
const cipherText = '{"salt":"caTQ3XBAXyY1Ven7BigFXA==","iv":"6SeOLNotz6cABOP7","ct":"INjO6gfZ/TstMdaRxe5OzRH9YGEMYPG01JkHSMktpMhxJd9mlXElnb9zbBBSfTjOZi04HCgMSEy4KYxJdn1yZszgynx0r2KrB+rJ+nT3S1HIfDJWgXpIYR0ab+90G7vmGrKfH8P9UZNjLdf1kaCkIQGsLIWCg/CJQeiRUjeNyaCImmwPjR0qaaACuNGJw6qotSZluvQpWa67PK2Svww2dYnEBMNyi+kpWC2H0DklLX2jwkrxqN3ikNdg0gxclqH+ilSJ6Tcls6vlmJnaatftmOV8o0nhv1NM0ABHebhHpQ7QRFtiD45Q9bFqYXgAaOg1xnswfGxOnu8OmKBW6vkFX2FQPejU9wlqEReSUO5SLG5BqqJWb7VOAlqiVQipSGnleKSmtK/gN1fNGuH4f0/sBxjnGC/sPHrSA5C2J4JDQ/7VbvpdAyQqSrlNqdXS/05oSZyfZH8fAlfINiT8g+jcNyI0B4/EbPX73hCJLJYcImi95uUpKKW4qNIUZ1rWiH7RG4V157/aufT1azByJ0Wh1kESUKuhab24m9/hs1CIb+kIJa/Aor4qb/vgLDAj+nZwbEvTKomo1NDGgzhIIqc/72AiWoVAbtQpWQfnJUYPIi5iGYKVqpW3tqPmm9BoQOg1soqtqGKBRKrlbpgKc7Eo4M0LMiz8xV1oAzlYKsQy1efP/0+1oec5nNxHgr9myQ07rDvTtsKlOlL996ykLfNU3W7w3jaKeTa9sx6AVpxsQx7jN4Y3ebrGihKaDxMzJeP+8zf/riI7StMJu/MDx/q3hqA3tfkfbAwO8Ab0/a0Oy4gfvbLqO/bveI2qwxPZQ2uDJi3UtYaupAo6sgRmDaX4/7Q+Oa7yup81j3LtGTY4/2E7DQmu5Jmtjaip+BnKBadnLLfxnT5IX22DwbpeplZZkvf146oBLq3o3JnBD02ovHCjNbbndBi+tO22vP5LEZVYVzDmNxtCNlb4i/Gnf9lqWtLSzTmHLJd4WAmyl6/wZxCVPwF0JqKDd5AEVR1cXZN8OqX9bUImJm91Wo9/ca+NLbXSPrfQ8/ItWaKrM1hnmkfC+2/YEimbCEuPo1x6qD6ZnExfrb7n5dEtNKIPI/CO/Bth/UYoMNT72K/LlbBWsY++Ete6eTp27jPezWBqJCCYiBoznELdZbJ0M+QDtmL9184apYfOJwbYfAbW4LPsQfSvlKvIXIh6YwRNi8xyRb9pnPBY0aA=","iter":150000,"alg":"AES-GCM-PBKDF2-SHA256"}';

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
    try {
        payload = JSON.parse(cipherText);
    } catch (e) {
        const errorMsg = "密文不是合法 JSON: " + (e && e.message ? e.message : String(e));
        alert(errorMsg);
        return errorMsg;
    }

    try {
        const res = await decryptArticle(payload, pass);
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
                this.startReadingTimer();
            } else {
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

                    this.$nextTick(() => {
                        this.addText();
                    });
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
            while (indexs.length > 0)
            {
                let index = indexs.pop();
                const el = els[index];
                await sleep(1000);
                el.innerText = this.toMars(el.innerText);
            }
        },
        toMars(text) {
            return convert(text, 3);
        },
        getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        startReadingTimer() {
            if (this.timerInterval) {
                clearInterval(this.timerInterval);
            }

            let counter = 0;
            this.timerInterval = setInterval(() => {
                this.readingTime++;
                counter++;
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
