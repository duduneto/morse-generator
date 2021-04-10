var timeRead = 400;
var shortTimeRead = 175;
var titleTypingSpeed = 75;
var titleTypingPause = 500;
var counterTitleLoop = 0;
var limitCounterTitleLoop = 1;
var stoped = false;

const stopBtn = document.querySelector('#stop-form');
const submitBtn = document.querySelector('#submit-form');
const inputTextarea = document.querySelector('#text');

inputTextarea.addEventListener('input', (e) => {
    if (e.target.value) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
})

async function readText(splitedText) {
    for (const charac of splitedText) {
        if (!stoped) {
            const morse_character = morse[charac];
            if (!!morse_character) {
                console.log('Break Line => ', morse_character === '\n')
                for (const morse_bin of morse_character) {
                    const beep = new Audio('./assets/sound/long_beep.wav');
                    if (!stoped) {
                        const generator = document.querySelector('#generator');
                        generator.classList.add('shadow-active');
                        beep.play();
                        await new Promise(resolve => setTimeout(async () => {
                            generator.classList.remove('shadow-active')
                            beep.pause();
                            resolve();
                        }, morse_bin === 1 ? timeRead : timeRead / 2));
                        await new Promise(resolve => setTimeout(resolve, shortTimeRead || timeRead / 2))
                    } else {
                        beep.pause();
                        break
                    }
                }
                await new Promise(resolve => setTimeout(resolve, shortTimeRead || (timeRead / 2) * 3))
            }
        } else {
            break
        }
    }
    stopBtn.disabled = true;
    submitBtn.disabled = false;
    inputTextarea.disabled = false;
}

function submitForm(event) {
    submitBtn.disabled = true;
    stopBtn.disabled = false;
    stoped = false;
    event.preventDefault();

    const _formData = new FormData(event.target);
    const values = Object.fromEntries(_formData);
    inputTextarea.disabled = true;
    const contentToConvert = String(values.text).toUpperCase();
    const splitedContent = contentToConvert.split("");

    readText(splitedContent);

    console.log(splitedContent);
}

function stopAudio() {
    submitBtn.disabled = false;
    inputTextarea.disabled = false;
    stopBtn.disabled = true;
    stoped = true;
}

document.getElementById('stop-form').addEventListener('click', () => {
    stopAudio();
})


// TYPING EFFECTS
var TxtType = function (el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
};

TxtType.prototype.tick = function () {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

    var that = this;
    var delta = titleTypingSpeed;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
        if(limitCounterTitleLoop <= counterTitleLoop){
            return
        }
        delta = this.period;
        this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
        counterTitleLoop++
        this.isDeleting = false;
        this.loopNum++;
        delta = titleTypingPause;
    }

    setTimeout(function () {
        that.tick();
    }, delta);
};

window.onload = function () {
    var elements = document.getElementsByClassName('typewrite');
    for (var i = 0; i < elements.length; i++) {
        var toRotate = elements[i].getAttribute('data-type');
        if (toRotate) {
            new TxtType(elements[i], JSON.parse(toRotate));
        }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};

