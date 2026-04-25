let clickHandler = null;
export function startTTS(options) {
    // Remove existing handler before re-adding (handles option changes)
    if (clickHandler)
        document.removeEventListener('click', clickHandler);
    clickHandler = (e) => {
        const target = e.target;
        // Skip panel itself and interactive elements
        if (target.closest('[data-a11y-panel-host]'))
            return;
        const text = target?.innerText?.trim();
        if (!text)
            return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = options.rate;
        utterance.lang = 'en-AU';
        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find((v) => v.name === options.voice);
        if (voice)
            utterance.voice = voice;
        window.speechSynthesis.speak(utterance);
    };
    document.addEventListener('click', clickHandler);
}
export function stopTTS() {
    window.speechSynthesis?.cancel();
    if (clickHandler) {
        document.removeEventListener('click', clickHandler);
        clickHandler = null;
    }
}
export function setPlaying(playing) {
    if (!window.speechSynthesis)
        return;
    if (playing)
        window.speechSynthesis.resume();
    else
        window.speechSynthesis.pause();
}
export function loadVoices() {
    if (!window.speechSynthesis)
        return Promise.resolve([]);
    return new Promise((resolve) => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            resolve(voices);
            return;
        }
        window.speechSynthesis.addEventListener('voiceschanged', () => {
            resolve(window.speechSynthesis.getVoices());
        }, { once: true });
        // Fallback timeout — some browsers fire voiceschanged unreliably
        setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
    });
}
