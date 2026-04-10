

const UUID = '3bd112f1-3bea-4f28-8a07-be0c8c456e67';
const CORRECT_MD5 = "feb7e7e5bcc86ddce773d28cc83ea9f8";
let convert = null;
import cipherText from './letter.js';
import errorContent from './error-letter.js';

await import('./words.js')

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
        const files = ['拾忆-钢琴.m4a','梦中的婚礼.m4a', '天空之城.m4a', '鸟之诗.m4a'];

        for (const file of files) {
            let item = {
                file: file,
                obj: null,
            };
            this.loadAndCacheAudio(file)
            this.#audios.push(item);
        }
        this.#setIndex();
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async loadAndCacheAudio(url) {
        const cache = await caches.open("audio-cache");

        let response = await cache.match(url);


        if (!response) {
            response = await fetch(url);
            cache.put(url, response.clone());
            return url;
        }

        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        return blobUrl;
    }

    async #getCurrentAudio() {
        const currentAudioInfo = this.#audios[this.#currentIndex];

        if (!currentAudioInfo) {
            return null;
        }
        if (!currentAudioInfo.obj) {
            try {
                //setTimeout(async () => {
                    const blobUrl = await this.loadAndCacheAudio(currentAudioInfo.file);
                    currentAudioInfo.obj = new Audio(blobUrl);
                    currentAudioInfo.obj.loop = true;
                    currentAudioInfo.obj.preload = 'auto';

                    currentAudioInfo.obj.addEventListener('error', (e) => {
                        console.error(`音频加载失败: ${currentAudioInfo.file}`, e);
                    });
                //},1000);

            } catch (error) {
                console.error(`创建Audio对象失败: ${currentAudioInfo.file}`, error);
                return null;
            }
        }
        return currentAudioInfo.obj;
    }

    async pause() {
        (await this.#getCurrentAudio())?.pause();
    }

    #setIndex() {
        this.#currentIndex = this.getRandomInt(0, this.#audios.length - 1);
    }

    async play() {
        this.#setIndex();
        (await this.#getCurrentAudio())?.play().catch(e => console.log("Audio play failed:", e));
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
    if (!pass) {
        const errorMsg = "请输入密码";
        alert(errorMsg);
        return errorMsg;
    }


    try {
        if (!cipherText) {
            const errorMsg = "请粘贴密文 JSON";
            alert(errorMsg);
            return errorMsg;
        }
        const payload = cipherText;
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
        },
        isErrorContent: {
            type: Boolean,
            default: false
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
                    <div class="reading-time" v-if="!isErrorContent">
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
        timerInterval: null,
        isErrorContent: false
    },
    mounted() {
        const savedReadingTime = localStorage.getItem('readingTime');
        if (savedReadingTime) {
            this.readingTime = parseInt(savedReadingTime, 10);
        }
    },
    watch: {
        isEnvelopeOpen(newVal) {
            if (newVal && !this.isErrorContent) {
                this.startReadingTimer();
            } else {
                this.stopReadingTimer();
                if (!this.isErrorContent) {
                    this.saveReadingTime();
                }
            }
        }
    },
    methods: {
        async handleEnvelopeClick() {
            console.log('handleEnvelopeClick called');
            console.log('isUnlocked:', this.isUnlocked);
            console.log('showPasswordModal before:', this.showPasswordModal);

            if (!this.isUnlocked) {
                if (this.isEnvelopeOpen) {
                    this.isEnvelopeOpen = false;
                    music.pause();
                } else {
                    this.showPasswordModal = true;
                    console.log('showPasswordModal after:', this.showPasswordModal);
                }
            } else {
                if (this.isEnvelopeOpen) {
                    music.pause();
                } else {
                    if (!this.isErrorContent) {
                        music.play();
                    }
                    if (!convert) {
                        const { default: convertModule } = await import('./words.js');
                        convert = convertModule;
                    }
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

                setTimeout(async () => {
                    this.isUnlocked = true;
                    this.isUnlocking = false;
                    this.isErrorContent = false;

                    const decodeBase64 = (str) => {
                        return decodeURIComponent(escape(atob(str)));
                    };
                    document.title = decodeBase64('5ae/5ae/55qE5L+h5Lu2');

                    if (!convert) {
                        const { default: convertModule } = await import('./words.js');
                        convert = convertModule;
                    }

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
                this.isUnlocking = true;
                this.showPasswordModal = false;

                setTimeout(() => {
                    this.isUnlocking = false;
                    this.isErrorContent = true;

                    if (open) {
                        this.isEnvelopeOpen = true;
                    }

                    this.errorMessage = '';
                    this.letterContent = errorContent;

                    this.$nextTick(() => {
                        this.addText();
                    });
                }, 800);
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
                el.innerText = await this.toMars(el.innerText);
            }
        },
        async toMars(text) {
            if (!convert) {
                const { default: convertModule } = await import('./words.js');
                convert = convertModule;
            }
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
    if (vueApp &&
        !container.contains(event.target) &&
        vueApp.isEnvelopeOpen &&
        !passwordModal.contains(event.target)) {
        vueApp.isEnvelopeOpen = false;
        music.pause();
    }
});

document.addEventListener('copy', async function (e) {
    const selection = window.getSelection().toString();
    if (!selection) return;
    e.preventDefault();
    if (!convert) {
        const { default: convertModule } = await import('./words.js');
        convert = convertModule;
    }
    const marsText = convert(selection, 3);
    e.clipboardData.setData('text/plain', marsText);
});
