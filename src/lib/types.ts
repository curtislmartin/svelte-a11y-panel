export interface PanelState {
  // Profiles
  epilepsy: boolean;
  visuallyImpaired: boolean;
  cognitive: boolean;
  adhd: boolean;
  blindness: boolean;

  // Readable Experience
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

  // Visually Pleasing
  darkContrast: boolean;
  lightContrast: boolean;
  monochrome: boolean;
  highContrast: boolean;
  highSaturation: boolean;
  lowSaturation: boolean;
  textColor: string;
  titleColor: string;
  bgColor: string;

  // Easy Orientation
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

  // Cognitive Reading
  tts: boolean;
  ttsPlaying: boolean;
  ttsRate: number;
  ttsVoice: string;
  virtualKeyboard: boolean;
  navigationKeys: boolean;
  voiceNav: boolean;
  linkNavigator: boolean;

}

export const DEFAULT_STATE: PanelState = {
  epilepsy: false, visuallyImpaired: false, cognitive: false, adhd: false, blindness: false,
  contentScaling: 100, readableFont: false, dyslexiaFont: false,
  highlightTitles: false, highlightLinks: false,
  fontSize: 16, lineHeight: 'Default', letterSpacing: 'Default', textAlign: null, textMagnifier: false,
  darkContrast: false, lightContrast: false, monochrome: false, highContrast: false,
  highSaturation: false, lowSaturation: false,
  textColor: '#3d4550', titleColor: '#003d26', bgColor: '#FAFCFA',
  muteSounds: false, hideImages: false, hideEmoji: false,
  readingGuide: false, readingMask: false, stopAnimations: false,
  highlightHover: false, highlightFocus: false, bigDarkCursor: false, bigLightCursor: false,
  tts: false, ttsPlaying: false, ttsRate: 1.0, ttsVoice: '',
  virtualKeyboard: false, navigationKeys: false, voiceNav: false, linkNavigator: false,
};

export const PROFILES = [
  { id: 'epilepsy',         label: 'Epilepsy Safe', desc: 'Stops flashing & animations',  icon: 'epilepsy' },
  { id: 'visuallyImpaired', label: 'Low Vision',    desc: 'High contrast & larger text',  icon: 'eye' },
  { id: 'cognitive',        label: 'Cognitive',     desc: 'Simplified, focused reading',   icon: 'cognitive' },
  { id: 'adhd',             label: 'ADHD',          desc: 'Reduces distractions',          icon: 'adhd' },
  { id: 'blindness',        label: 'Blindness',     desc: 'Optimised for screen readers',  icon: 'blindness' },
] as const;

export const PROFILE_SETTINGS: Record<string, Partial<PanelState>> = {
  epilepsy:         { stopAnimations: true,  muteSounds: true },
  visuallyImpaired: { highContrast: true,    contentScaling: 120, bigDarkCursor: true, fontSize: 18 },
  cognitive:        { readableFont: true,    readingMask: true,   lineHeight: 'Large' },
  adhd:             { readingGuide: true,    hideEmoji: true,     stopAnimations: true },
  blindness:        { tts: true,             navigationKeys: true },
};
