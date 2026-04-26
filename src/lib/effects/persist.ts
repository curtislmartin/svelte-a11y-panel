import type { PanelState } from '../types';
import { DEFAULT_STATE } from '../types';
import { getConfig } from './config';

let saveTimer: ReturnType<typeof setTimeout> | null = null;

const CSS_COLOR_RE = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\))$/;
const LH_ALLOWED = new Set(['Default', 'Medium', 'Large', 'XL']);
const LS_ALLOWED = new Set(['Default', '+1px', '+2px', '+3px']);
const TA_ALLOWED = new Set(['left', 'center', 'right', 'justify', null]);

function sanitizeState(raw: Record<string, unknown>): PanelState {
  const s = { ...DEFAULT_STATE };
  const bool = (v: unknown, fallback: boolean) => typeof v === 'boolean' ? v : fallback;
  const num = (v: unknown, fallback: number, min: number, max: number) =>
    typeof v === 'number' && isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;
  const color = (v: unknown, fallback: string) =>
    typeof v === 'string' && CSS_COLOR_RE.test(v.trim()) ? v.trim() : fallback;

  s.epilepsy         = bool(raw.epilepsy, s.epilepsy);
  s.visuallyImpaired = bool(raw.visuallyImpaired, s.visuallyImpaired);
  s.cognitive        = bool(raw.cognitive, s.cognitive);
  s.adhd             = bool(raw.adhd, s.adhd);
  s.blindness        = bool(raw.blindness, s.blindness);

  s.contentScaling   = num(raw.contentScaling, s.contentScaling, 50, 200);
  s.readableFont     = bool(raw.readableFont, s.readableFont);
  s.dyslexiaFont     = bool(raw.dyslexiaFont, s.dyslexiaFont);
  s.highlightTitles  = bool(raw.highlightTitles, s.highlightTitles);
  s.highlightLinks   = bool(raw.highlightLinks, s.highlightLinks);
  s.fontSize         = num(raw.fontSize, s.fontSize, 10, 32);
  s.lineHeight       = LH_ALLOWED.has(raw.lineHeight as string) ? raw.lineHeight as string : s.lineHeight;
  s.letterSpacing    = LS_ALLOWED.has(raw.letterSpacing as string) ? raw.letterSpacing as string : s.letterSpacing;
  s.textAlign        = TA_ALLOWED.has(raw.textAlign as string | null) ? raw.textAlign as string | null : s.textAlign;
  s.textMagnifier    = bool(raw.textMagnifier, s.textMagnifier);

  s.darkContrast     = bool(raw.darkContrast, s.darkContrast);
  s.lightContrast    = bool(raw.lightContrast, s.lightContrast);
  s.monochrome       = bool(raw.monochrome, s.monochrome);
  s.highContrast     = bool(raw.highContrast, s.highContrast);
  s.highSaturation   = bool(raw.highSaturation, s.highSaturation);
  s.lowSaturation    = bool(raw.lowSaturation, s.lowSaturation);
  s.textColor        = color(raw.textColor, s.textColor);
  s.titleColor       = color(raw.titleColor, s.titleColor);
  s.bgColor          = color(raw.bgColor, s.bgColor);

  s.muteSounds       = bool(raw.muteSounds, s.muteSounds);
  s.hideImages       = bool(raw.hideImages, s.hideImages);
  s.hideEmoji        = bool(raw.hideEmoji, s.hideEmoji);
  s.readingGuide     = bool(raw.readingGuide, s.readingGuide);
  s.readingMask      = bool(raw.readingMask, s.readingMask);
  s.stopAnimations   = bool(raw.stopAnimations, s.stopAnimations);
  s.highlightHover   = bool(raw.highlightHover, s.highlightHover);
  s.highlightFocus   = bool(raw.highlightFocus, s.highlightFocus);
  s.bigDarkCursor    = bool(raw.bigDarkCursor, s.bigDarkCursor);
  s.bigLightCursor   = bool(raw.bigLightCursor, s.bigLightCursor);

  s.tts              = bool(raw.tts, s.tts);
  s.ttsPlaying       = false; // never restore mid-playback state
  s.ttsRate          = num(raw.ttsRate, s.ttsRate, 0.1, 10);
  s.ttsVoice         = typeof raw.ttsVoice === 'string' ? raw.ttsVoice.slice(0, 200) : s.ttsVoice;
  s.virtualKeyboard  = bool(raw.virtualKeyboard, s.virtualKeyboard);
  s.navigationKeys   = bool(raw.navigationKeys, s.navigationKeys);
  s.voiceNav         = bool(raw.voiceNav, s.voiceNav);
  s.linkNavigator    = bool(raw.linkNavigator, s.linkNavigator);

  return s;
}

export function save(state: PanelState): void {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(getConfig().storageKey, JSON.stringify(state)); } catch {}
  }, 300);
}

export function load(): PanelState {
  try {
    const raw = localStorage.getItem(getConfig().storageKey);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return { ...DEFAULT_STATE };
    return sanitizeState(parsed as Record<string, unknown>);
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function clear(): void {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  localStorage.removeItem(getConfig().storageKey);
}
