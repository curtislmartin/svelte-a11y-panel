import type { PanelState } from '../types';
type $$ComponentProps = {
    s: PanelState;
    set: (k: keyof PanelState, v: unknown) => void;
    voices?: SpeechSynthesisVoice[];
    voiceNavSupported?: boolean;
};
declare const CognitiveSection: import("svelte").Component<$$ComponentProps, {}, "">;
type CognitiveSection = ReturnType<typeof CognitiveSection>;
export default CognitiveSection;
