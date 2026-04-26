export function isSupported(): boolean {
  return typeof window !== 'undefined' &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
}

type Recognition = any;
let recognition: Recognition = null;
let destroyed = false;

const COMMANDS = [
  { pattern: /scroll\s+down/i,    action: () => window.scrollBy({ top: 300, behavior: 'smooth' }) },
  { pattern: /scroll\s+up/i,      action: () => window.scrollBy({ top: -300, behavior: 'smooth' }) },
  { pattern: /go\s+to\s+top/i,    action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
  { pattern: /go\s+to\s+bottom/i, action: () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }) },
  { pattern: /go\s+back/i,        action: () => history.back() },
  { pattern: /go\s+forward/i,     action: () => history.forward() },
  { pattern: /go\s+home/i,        action: () => { window.location.href = '/'; } },
];

export function start(onTranscript?: (text: string) => void): void {
  if (!isSupported() || recognition) return;
  destroyed = false;
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  recognition = new SR();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-AU';

  recognition.onresult = (event: any) => {
    const transcript: string = event.results[event.results.length - 1][0].transcript.trim();
    onTranscript?.(transcript);
    for (const cmd of COMMANDS) {
      if (cmd.pattern.test(transcript)) { cmd.action(); break; }
    }
  };
  recognition.onerror = (e: any) => {
    if (e.error !== 'no-speech' && e.error !== 'aborted') {
      console.warn('[VoiceNav]', e.error);
    }
  };
  recognition.onend = () => {
    if (!destroyed && recognition) recognition.start();
  };
  recognition.start();
}

export function stop(): void {
  destroyed = true;
  if (recognition) {
    recognition.onend = null;
    recognition.stop();
    recognition = null;
  }
}
