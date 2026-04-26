import { getConfig } from './config';
const ATTR = 'data-a11y-panel-overlay';
const EMOJI_RE = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;
function getOrCreate(id) {
    let el = document.querySelector(`[${ATTR}="${id}"]`);
    if (!el) {
        el = document.createElement('div');
        el.setAttribute(ATTR, id);
        document.body.appendChild(el);
    }
    return el;
}
function removeEl(id) { document.querySelector(`[${ATTR}="${id}"]`)?.remove(); }
// ── Reading Guide ─────────────────────────────────────────────
let guideHandler = null;
function startReadingGuide() {
    if (guideHandler)
        return; // already running
    const guide = getOrCreate('reading-guide');
    Object.assign(guide.style, {
        position: 'fixed', left: '0', width: '100%', height: '2px',
        background: getConfig().accentColor, zIndex: '2147483646', pointerEvents: 'none', top: '0',
    });
    guideHandler = (e) => { guide.style.top = `${e.clientY}px`; };
    document.addEventListener('mousemove', guideHandler);
}
function stopReadingGuide() {
    if (guideHandler) {
        document.removeEventListener('mousemove', guideHandler);
        guideHandler = null;
    }
    removeEl('reading-guide');
}
// ── Reading Mask ──────────────────────────────────────────────
let maskHandler = null;
const GAP = 80;
function startReadingMask() {
    if (maskHandler)
        return; // already running
    const top = getOrCreate('reading-mask-top');
    const bot = getOrCreate('reading-mask-bottom');
    const base = { position: 'fixed', left: '0', width: '100%', background: 'rgba(0,0,0,0.55)', zIndex: '2147483645', pointerEvents: 'none' };
    const midY = window.innerHeight / 2;
    Object.assign(top.style, base, { top: '0', height: `${Math.max(0, midY - GAP / 2)}px` });
    Object.assign(bot.style, base, { top: `${midY + GAP / 2}px`, bottom: '', height: `${Math.max(0, window.innerHeight - midY - GAP / 2)}px` });
    maskHandler = (e) => {
        const y = e.clientY;
        top.style.height = `${Math.max(0, y - GAP / 2)}px`;
        bot.style.top = `${y + GAP / 2}px`;
        bot.style.height = `${Math.max(0, window.innerHeight - y - GAP / 2)}px`;
    };
    document.addEventListener('mousemove', maskHandler);
}
function stopReadingMask() {
    if (maskHandler) {
        document.removeEventListener('mousemove', maskHandler);
        maskHandler = null;
    }
    removeEl('reading-mask-top');
    removeEl('reading-mask-bottom');
}
// ── Text Magnifier ────────────────────────────────────────────
let magEnter = null;
let magLeave = null;
function startMagnifier() {
    if (magEnter)
        return; // already running
    const mag = getOrCreate('text-magnifier');
    Object.assign(mag.style, {
        position: 'fixed', background: '#fff', border: `2px solid ${getConfig().accentColor}`,
        borderRadius: '8px', padding: '8px 12px', maxWidth: '400px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: '2147483647',
        pointerEvents: 'none', display: 'none', fontSize: '1.5em',
        fontFamily: getConfig().uiFontFamily, lineHeight: '1.4', color: '#333',
    });
    magEnter = (e) => {
        const t = e.target;
        const text = t?.innerText?.trim();
        if (!text || text.length < 3) {
            mag.style.display = 'none';
            return;
        }
        mag.textContent = text.slice(0, 200);
        mag.style.display = 'block';
        const r = t.getBoundingClientRect();
        mag.style.left = `${Math.min(r.left, window.innerWidth - 420)}px`;
        mag.style.top = `${Math.min(r.bottom + 8, window.innerHeight - 120)}px`;
    };
    magLeave = () => { mag.style.display = 'none'; };
    document.addEventListener('pointerover', magEnter);
    document.addEventListener('pointerout', magLeave);
}
function stopMagnifier() {
    if (magEnter)
        document.removeEventListener('pointerover', magEnter);
    if (magLeave)
        document.removeEventListener('pointerout', magLeave);
    magEnter = null;
    magLeave = null;
    removeEl('text-magnifier');
}
// ── Mute Sounds ───────────────────────────────────────────────
let muteObserver = null;
const originalMuted = new WeakMap();
function muteAll() {
    document.querySelectorAll('audio, video').forEach(el => {
        if (!originalMuted.has(el))
            originalMuted.set(el, el.muted);
        el.muted = true;
    });
}
function startMuteSounds() {
    muteAll();
    muteObserver = new MutationObserver(muteAll);
    muteObserver.observe(document.body, { childList: true, subtree: true });
}
function stopMuteSounds() {
    muteObserver?.disconnect();
    muteObserver = null;
    document.querySelectorAll('audio, video').forEach(el => {
        el.muted = originalMuted.get(el) ?? false;
        originalMuted.delete(el);
    });
}
// ── Hide Emoji ────────────────────────────────────────────────
function doHideEmoji() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let n;
    while ((n = walker.nextNode())) {
        const t = n;
        EMOJI_RE.lastIndex = 0;
        if (EMOJI_RE.test(t.data) && !t.parentElement?.closest('[data-a11y-panel-emoji],[data-a11y-panel-overlay]')) {
            nodes.push(t);
        }
    }
    nodes.forEach(textNode => {
        EMOJI_RE.lastIndex = 0;
        const wrapper = document.createElement('span');
        wrapper.setAttribute('data-a11y-panel-emoji', '');
        let lastIndex = 0;
        let match;
        while ((match = EMOJI_RE.exec(textNode.data)) !== null) {
            if (match.index > lastIndex) {
                wrapper.appendChild(document.createTextNode(textNode.data.slice(lastIndex, match.index)));
            }
            const span = document.createElement('span');
            span.className = 'cc-emoji-hidden';
            span.textContent = match[0];
            wrapper.appendChild(span);
            lastIndex = match.index + match[0].length;
        }
        if (lastIndex < textNode.data.length) {
            wrapper.appendChild(document.createTextNode(textNode.data.slice(lastIndex)));
        }
        textNode.parentNode?.replaceChild(wrapper, textNode);
    });
}
function doShowEmoji() {
    const parents = new Set();
    document.querySelectorAll('[data-a11y-panel-emoji]').forEach(w => {
        if (w.parentNode) {
            w.parentNode.replaceChild(document.createTextNode(w.textContent ?? ''), w);
            parents.add(w.parentNode);
        }
    });
    parents.forEach(p => p.normalize?.());
}
let prev = {
    readingGuide: false, readingMask: false, textMagnifier: false, muteSounds: false, hideEmoji: false,
};
export function sync(s) {
    if (s.readingGuide && !prev.readingGuide)
        startReadingGuide();
    if (!s.readingGuide && prev.readingGuide)
        stopReadingGuide();
    if (s.readingMask && !prev.readingMask)
        startReadingMask();
    if (!s.readingMask && prev.readingMask)
        stopReadingMask();
    if (s.textMagnifier && !prev.textMagnifier)
        startMagnifier();
    if (!s.textMagnifier && prev.textMagnifier)
        stopMagnifier();
    if (s.muteSounds && !prev.muteSounds)
        startMuteSounds();
    if (!s.muteSounds && prev.muteSounds)
        stopMuteSounds();
    if (s.hideEmoji && !prev.hideEmoji)
        doHideEmoji();
    if (!s.hideEmoji && prev.hideEmoji)
        doShowEmoji();
    prev = { ...s };
}
export function cleanup() {
    stopReadingGuide();
    stopReadingMask();
    stopMagnifier();
    stopMuteSounds();
    doShowEmoji();
    prev = { readingGuide: false, readingMask: false, textMagnifier: false, muteSounds: false, hideEmoji: false };
}
// Clean up overlays when module is hot-replaced during development
if (import.meta.hot) {
    import.meta.hot.dispose(() => cleanup());
}
