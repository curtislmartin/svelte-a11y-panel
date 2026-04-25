type OverlayState = Pick<import('../types').PanelState, 'readingGuide' | 'readingMask' | 'textMagnifier' | 'muteSounds' | 'hideEmoji'>;
export declare function sync(s: OverlayState): void;
export declare function cleanup(): void;
export {};
