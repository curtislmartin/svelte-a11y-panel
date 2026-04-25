export interface PanelState {
    epilepsy: boolean;
    visuallyImpaired: boolean;
    cognitive: boolean;
    adhd: boolean;
    blindness: boolean;
    contentScaling: number;
    readableFont: boolean;
    dyslexiaFont: boolean;
    highlightTitles: boolean;
    highlightLinks: boolean;
    fontSize: number;
    lineHeight: string;
    letterSpacing: string;
    textAlign: string | null;
    textMagnifier: boolean;
    darkContrast: boolean;
    lightContrast: boolean;
    monochrome: boolean;
    highContrast: boolean;
    highSaturation: boolean;
    lowSaturation: boolean;
    textColor: string;
    titleColor: string;
    bgColor: string;
    muteSounds: boolean;
    hideImages: boolean;
    hideEmoji: boolean;
    readingGuide: boolean;
    readingMask: boolean;
    stopAnimations: boolean;
    highlightHover: boolean;
    highlightFocus: boolean;
    bigDarkCursor: boolean;
    bigLightCursor: boolean;
    tts: boolean;
    ttsPlaying: boolean;
    ttsRate: number;
    ttsVoice: string;
    virtualKeyboard: boolean;
    navigationKeys: boolean;
    voiceNav: boolean;
    linkNavigator: boolean;
}
export declare const DEFAULT_STATE: PanelState;
export declare const PROFILES: readonly [{
    readonly id: "epilepsy";
    readonly label: "Epilepsy Safe";
    readonly desc: "Stops flashing & animations";
    readonly icon: "epilepsy";
}, {
    readonly id: "visuallyImpaired";
    readonly label: "Low Vision";
    readonly desc: "High contrast & larger text";
    readonly icon: "eye";
}, {
    readonly id: "cognitive";
    readonly label: "Cognitive";
    readonly desc: "Simplified, focused reading";
    readonly icon: "cognitive";
}, {
    readonly id: "adhd";
    readonly label: "ADHD";
    readonly desc: "Reduces distractions";
    readonly icon: "adhd";
}, {
    readonly id: "blindness";
    readonly label: "Blindness";
    readonly desc: "Optimised for screen readers";
    readonly icon: "blindness";
}];
export declare const PROFILE_SETTINGS: Record<string, Partial<PanelState>>;
