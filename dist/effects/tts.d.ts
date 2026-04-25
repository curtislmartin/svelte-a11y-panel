export declare function startTTS(options: {
    rate: number;
    voice: string;
}): void;
export declare function stopTTS(): void;
export declare function setPlaying(playing: boolean): void;
export declare function loadVoices(): Promise<SpeechSynthesisVoice[]>;
