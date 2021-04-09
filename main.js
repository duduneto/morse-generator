const beep = new Audio('./assets/sound/long_beep.wav');
var timeRead = 600;

async function readText(splitedText) {
    for (const charac of splitedText) {
        const morse_character = morse[charac];
        for (const morse_bin of morse_character) {
            beep.play();
            await new Promise(resolve => setTimeout(async () => {
                beep.pause();
                resolve();
            }, morse_bin === 1 ? timeRead : timeRead / 2));
            await new Promise(resolve => setTimeout(resolve, timeRead / 2))
        }
        await new Promise(resolve => setTimeout(resolve, (timeRead / 2) * 3))
    }
}

function submitForm(event) {
    event.preventDefault();

    const _formData = new FormData(event.target);
    const values = Object.fromEntries(_formData);
    const contentToConvert = String(values.text).toUpperCase();
    const splitedContent = contentToConvert.split("");

    readText(splitedContent);

    console.log(splitedContent);
}


