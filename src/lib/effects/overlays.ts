import { getConfig } from './config';

const ATTR = 'data-a11y-panel-overlay';
const EMOJI_RE = /\p{Emoji_Presentation}|\p{Extended_Pictographic}/gu;

function getOrCreate(id: string): HTMLDivElement {
  let el = document.querySelector<HTMLDivElement>(`[${ATTR}="${id}"]`);
  if (!el) {
    el = document.createElement('div');
    el.setAttribute(ATTR, id);
    document.body.appendChild(el);
  }
  return el;
}
function removeEl(id: string) { document.querySelector(`[${ATTR}="${id}"]`)?.remove(); }

// ── Reading Guide ─────────────────────────────────────────────
let guideHandler: ((e: MouseEvent) => void) | null = null;
function startReadingGuide() {
  if (guideHandler) return; // already running
  const guide = getOrCreate('reading-guide');
  Object.assign(guide.style, {
    position:'fixed',left:'0',width:'100%',height:'2px',
    background: getConfig().accentColor, zIndex:'2147483646',pointerEvents:'none',top:'0',
  });
  guideHandler = (e: MouseEvent) => { guide.style.top = `${e.clientY}px`; };
  document.addEventListener('mousemove', guideHandler);
}
function stopReadingGuide() {
  if (guideHandler) { document.removeEventListener('mousemove', guideHandler); guideHandler = null; }
  removeEl('reading-guide');
}

// ── Reading Mask ──────────────────────────────────────────────
let maskHandler: ((e: MouseEvent) => void) | null = null;
const GAP = 80;
function startReadingMask() {
  if (maskHandler) return; // already running
  const top = getOrCreate('reading-mask-top');
  const bot = getOrCreate('reading-mask-bottom');
  const base = { position:'fixed',left:'0',width:'100%',background:'rgba(0,0,0,0.55)',zIndex:'2147483645',pointerEvents:'none' };
  const midY = window.innerHeight / 2;
  Object.assign(top.style, base, { top:'0', height:`${Math.max(0, midY - GAP/2)}px` });
  Object.assign(bot.style, base, { top:`${midY + GAP/2}px`, bottom:'', height:`${Math.max(0, window.innerHeight - midY - GAP/2)}px` });
  maskHandler = (e: MouseEvent) => {
    const y = e.clientY;
    top.style.height = `${Math.max(0, y - GAP/2)}px`;
    bot.style.top = `${y + GAP/2}px`;
    bot.style.height = `${Math.max(0, window.innerHeight - y - GAP/2)}px`;
  };
  document.addEventListener('mousemove', maskHandler);
}
function stopReadingMask() {
  if (maskHandler) { document.removeEventListener('mousemove', maskHandler); maskHandler = null; }
  removeEl('reading-mask-top'); removeEl('reading-mask-bottom');
}

// ── Text Magnifier ────────────────────────────────────────────
let magEnter: ((e: Event) => void) | null = null;
let magLeave: (() => void) | null = null;
function startMagnifier() {
  if (magEnter) return; // already running
  const mag = getOrCreate('text-magnifier');
  Object.assign(mag.style, {
    position:'fixed',background:'#fff',border:`2px solid ${getConfig().accentColor}`,
    borderRadius:'8px',padding:'8px 12px',maxWidth:'400px',
    boxShadow:'0 4px 20px rgba(0,0,0,0.15)',zIndex:'2147483647',
    pointerEvents:'none',display:'none',fontSize:'1.5em',
    fontFamily: getConfig().uiFontFamily, lineHeight:'1.4',color:'#333',
  });
  magEnter = (e: Event) => {
    const t = (e as PointerEvent).target as HTMLElement;
    const text = t?.innerText?.trim();
    if (!text || text.length < 3) { mag.style.display='none'; return; }
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
  if (magEnter) document.removeEventListener('pointerover', magEnter);
  if (magLeave) document.removeEventListener('pointerout', magLeave);
  magEnter = null; magLeave = null;
  removeEl('text-magnifier');
}

// ── Mute Sounds ───────────────────────────────────────────────
let muteObserver: MutationObserver | null = null;
const originalMuted = new WeakMap<HTMLMediaElement, boolean>();
function muteAll() {
  document.querySelectorAll<HTMLMediaElement>('audio, video').forEach(el => {
    if (!originalMuted.has(el)) originalMuted.set(el, el.muted);
    el.muted = true;
  });
}
function startMuteSounds() {
  muteAll();
  muteObserver = new MutationObserver(muteAll);
  muteObserver.observe(document.body, { childList: true, subtree: true });
}
function stopMuteSounds() {
  muteObserver?.disconnect(); muteObserver = null;
  document.querySelectorAll<HTMLMediaElement>('audio, video').forEach(el => {
    el.muted = originalMuted.get(el) ?? false;
    originalMuted.delete(el);
  });
}

// ── Hide Emoji ────────────────────────────────────────────────
function doHideEmoji() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) {
    const t = n as Text;
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
    let match: RegExpExecArray | null;
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
  const parents = new Set<Node>();
  document.querySelectorAll('[data-a11y-panel-emoji]').forEach(w => {
    if (w.parentNode) {
      w.parentNode.replaceChild(document.createTextNode(w.textContent ?? ''), w);
      parents.add(w.parentNode);
    }
  });
  parents.forEach(p => (p as Element).normalize?.());
}

// ── Public sync ───────────────────────────────────────────────
type OverlayState = Pick<import('../types').PanelState,
  'readingGuide'|'readingMask'|'textMagnifier'|'muteSounds'|'hideEmoji'>;

let prev: OverlayState = {
  readingGuide:false,readingMask:false,textMagnifier:false,muteSounds:false,hideEmoji:false,
};

export function sync(s: OverlayState): void {
  if (s.readingGuide && !prev.readingGuide) startReadingGuide();
  if (!s.readingGuide && prev.readingGuide) stopReadingGuide();
  if (s.readingMask && !prev.readingMask) startReadingMask();
  if (!s.readingMask && prev.readingMask) stopReadingMask();
  if (s.textMagnifier && !prev.textMagnifier) startMagnifier();
  if (!s.textMagnifier && prev.textMagnifier) stopMagnifier();
  if (s.muteSounds && !prev.muteSounds) startMuteSounds();
  if (!s.muteSounds && prev.muteSounds) stopMuteSounds();
  if (s.hideEmoji && !prev.hideEmoji) doHideEmoji();
  if (!s.hideEmoji && prev.hideEmoji) doShowEmoji();
  prev = { ...s };
}

export function cleanup(): void {
  stopReadingGuide(); stopReadingMask(); stopMagnifier(); stopMuteSounds(); doShowEmoji();
  prev = { readingGuide:false, readingMask:false, textMagnifier:false, muteSounds:false, hideEmoji:false };
}

// Clean up overlays when module is hot-replaced during development
if (import.meta.hot) {
  import.meta.hot.dispose(() => cleanup());
}
