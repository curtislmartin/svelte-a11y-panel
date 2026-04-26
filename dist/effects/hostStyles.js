import { DEFAULT_STATE } from '../types';
import { getConfig } from './config';
import { DEFAULT_CONFIG } from '../config';
const LH_MAP = {
    Default: '1.5', Medium: '1.8', Large: '2.1', XL: '2.5',
};
const LS_MAP = {
    Default: 'normal', '+1px': '0.05em', '+2px': '0.1em', '+3px': '0.15em',
};
const CSS_COLOR_RE = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\))$/;
const TEXT_ALIGN_ALLOWED = new Set(['left', 'center', 'right', 'justify']);
function safeColor(val, fallback) {
    return CSS_COLOR_RE.test(val.trim()) ? val.trim() : fallback;
}
function safeFontUrl(url) {
    try {
        const u = new URL(url);
        if (u.protocol !== 'https:')
            return DEFAULT_CONFIG.dyslexiaFontUrl;
        if (/['"()\\]/.test(url))
            return DEFAULT_CONFIG.dyslexiaFontUrl;
        return url;
    }
    catch {
        return DEFAULT_CONFIG.dyslexiaFontUrl;
    }
}
const DARK_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M5 3l19 11-7 2-4 8z' fill='%23111' stroke='%23fff' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E") 5 3`;
const LIGHT_CURSOR = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cpath d='M5 3l19 11-7 2-4 8z' fill='%23fff' stroke='%23111' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E") 5 3`;
export function buildCSS(s) {
    const rules = [];
    const rawAccent = getConfig().accentColor;
    const accent = safeColor(rawAccent, DEFAULT_CONFIG.accentColor);
    if (accent !== rawAccent) {
        console.warn(`[svelte-a11y-panel] accentColor "${rawAccent}" is not a valid CSS color value and has been ignored. Use hex (#rrggbb), rgb(), rgba(), or hsl() format.`);
    }
    if (s.contentScaling !== 100) {
        const scaling = Math.min(200, Math.max(50, Number(s.contentScaling) || 100));
        rules.push(`html { zoom: ${scaling}%; }`);
    }
    if (s.dyslexiaFont) {
        rules.push(`@font-face { font-family: 'OpenDyslexic'; src: url('${safeFontUrl(getConfig().dyslexiaFontUrl)}') format('woff2'); font-display: swap; }`);
        rules.push(`html, body, h1, h2, h3, h4, h5, h6, p, div, span, li, td, th, a, button, input, textarea, select, label { font-family: 'OpenDyslexic', sans-serif !important; }`);
    }
    else if (s.readableFont) {
        rules.push(`html, body, h1, h2, h3, h4, h5, h6, p, div, span, li, td, th, a, button, input, textarea, select, label { font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif !important; }`);
    }
    if (s.fontSize !== DEFAULT_STATE.fontSize) {
        const fontSize = Math.min(32, Math.max(10, Number(s.fontSize) || DEFAULT_STATE.fontSize));
        rules.push(`html { font-size: ${fontSize}px !important; }`);
    }
    if (s.lineHeight !== 'Default') {
        rules.push(`body, body * { line-height: ${LH_MAP[s.lineHeight] ?? '1.5'} !important; }`);
    }
    if (s.letterSpacing !== 'Default') {
        rules.push(`body { letter-spacing: ${LS_MAP[s.letterSpacing] ?? 'normal'} !important; }`);
    }
    if (s.textAlign && TEXT_ALIGN_ALLOWED.has(s.textAlign)) {
        rules.push(`body, p, li { text-align: ${s.textAlign} !important; }`);
    }
    if (s.highlightTitles) {
        rules.push(`h1, h2, h3, h4, h5, h6 { background: #fffbcc !important; outline: 2px solid ${accent} !important; padding: 2px 4px !important; }`);
    }
    if (s.highlightLinks) {
        rules.push(`a { background: #e8f4ec !important; outline: 2px solid ${accent} !important; }`);
    }
    // Build combined html filter (only one filter rule allowed — CSS can't stack multiple filter: declarations)
    const filters = [];
    if (s.darkContrast)
        filters.push('invert(1) hue-rotate(180deg)');
    else if (s.monochrome)
        filters.push('grayscale(1)');
    else if (s.highContrast)
        filters.push('contrast(1.5)');
    if (s.highSaturation)
        filters.push('saturate(2.5)');
    else if (s.lowSaturation)
        filters.push('saturate(0.4)');
    if (filters.length > 0)
        rules.push(`html { filter: ${filters.join(' ')}; }`);
    if (s.darkContrast) {
        // Re-invert images so they look natural under invert filter
        rules.push(`img, video, canvas, picture, svg { filter: invert(1) hue-rotate(180deg); }`);
    }
    if (s.lightContrast) {
        rules.push(`html, body { background: #fff !important; color: #000 !important; }`);
    }
    if (s.highContrast) {
        rules.push(`body { background: #000 !important; color: #fff !important; } a { color: #ff0 !important; }`);
    }
    const textColor = safeColor(s.textColor, DEFAULT_STATE.textColor);
    const titleColor = safeColor(s.titleColor, DEFAULT_STATE.titleColor);
    const bgColor = safeColor(s.bgColor, DEFAULT_STATE.bgColor);
    if (textColor !== DEFAULT_STATE.textColor) {
        rules.push(`body, p, li, span, td { color: ${textColor} !important; }`);
    }
    if (titleColor !== DEFAULT_STATE.titleColor) {
        rules.push(`h1, h2, h3, h4, h5, h6 { color: ${titleColor} !important; }`);
    }
    if (bgColor !== DEFAULT_STATE.bgColor) {
        rules.push(`html, body { background: ${bgColor} !important; }`);
    }
    if (s.hideImages) {
        rules.push(`img, picture, figure img, video { visibility: hidden !important; }`);
    }
    if (s.hideEmoji) {
        rules.push(`.cc-emoji-hidden { display: none !important; }`);
    }
    if (s.stopAnimations) {
        rules.push(`*, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; scroll-behavior: auto !important; }`);
    }
    if (s.highlightHover) {
        rules.push(`*:hover { outline: 3px solid ${accent} !important; outline-offset: 2px !important; }`);
    }
    if (s.highlightFocus) {
        rules.push(`*:focus { outline: 3px solid ${accent} !important; outline-offset: 2px !important; box-shadow: 0 0 0 4px ${accent}33 !important; }`);
    }
    if (s.bigDarkCursor) {
        rules.push(`* { cursor: ${DARK_CURSOR}, auto !important; }`);
    }
    else if (s.bigLightCursor) {
        rules.push(`* { cursor: ${LIGHT_CURSOR}, auto !important; }`);
    }
    return rules.join('\n');
}
export function apply(state) {
    let el = document.getElementById('a11y-panel-host-styles');
    if (!el) {
        el = document.createElement('style');
        el.id = 'a11y-panel-host-styles';
        document.head.appendChild(el);
    }
    el.textContent = buildCSS(state);
}
export function remove() {
    document.getElementById('a11y-panel-host-styles')?.remove();
}
