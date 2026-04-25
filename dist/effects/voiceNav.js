export function isSupported() {
    return typeof window !== 'undefined' &&
        !!(window.SpeechRecognition || window.webkitSpeechRecognition);
}
let recognition = null;
const COMMANDS = [
    { pattern: /scroll\s+down/i, action: () => window.scrollBy({ top: 300, behavior: 'smooth' }) },
    { pattern: /scroll\s+up/i, action: () => window.scrollBy({ top: -300, behavior: 'smooth' }) },
    { pattern: /go\s+to\s+top/i, action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
    { pattern: /go\s+to\s+bottom/i, action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) },
    { pattern: /go\s+back/i, action: () => history.back() },
    { pattern: /go\s+forward/i, action: () => history.forward() },
    { pattern: /go\s+home/i, action: () => { window.location.href = '/'; } },
];
export function start(onTranscript) {
    if (!isSupported() || recognition)
        return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-AU';
    recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim();
        onTranscript?.(transcript);
        for (const cmd of COMMANDS) {
            if (cmd.pattern.test(transcript)) {
                cmd.action();
                break;
            }
        }
    };
    recognition.onerror = (e) => {
        if (e.error !== 'no-speech' && e.error !== 'aborted') {
            console.warn('[VoiceNav]', e.error);
        }
    };
    recognition.onend = () => {
        if (recognition)
            recognition.start();
    };
    recognition.start();
}
export function stop() {
    if (recognition) {
        recognition.onend = null;
        recognition.stop();
        recognition = null;
    }
}
