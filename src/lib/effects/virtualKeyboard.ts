import { getConfig } from './config';

const ATTR = 'data-cc-vkb';

const ROWS: string[][] = [
  ['`','1','2','3','4','5','6','7','8','9','0','-','=','⌫'],
  ['Tab','q','w','e','r','t','y','u','i','o','p','[',']','\\'],
  ['⇪','a','s','d','f','g','h','j','k','l',';',"'",'↵'],
  ['⇧','z','x','c','v','b','n','m',',','.','/',  '⇧'],
  ['Space'],
];

const SPECIAL: Record<string, string> = {
  '⌫': 'Backspace', '↵': 'Enter', 'Tab': 'Tab', '⇧': 'Shift', '⇪': 'CapsLock', 'Space': ' ',
};

let shiftOn = false;
let capsOn = false;

function keyLabel(k: string): string {
  if (SPECIAL[k]) return k;
  return (shiftOn || capsOn) ? k.toUpperCase() : k;
}

function dispatchKey(k: string): void {
  const target = document.activeElement as HTMLElement;
  if (!target || target.closest('[data-cc-vkb]')) return;

  const mapped = SPECIAL[k] ?? (shiftOn || capsOn ? k.toUpperCase() : k);

  target.dispatchEvent(new KeyboardEvent('keydown', { key: mapped, bubbles: true, cancelable: true }));
  target.dispatchEvent(new KeyboardEvent('keyup',   { key: mapped, bubbles: true }));

  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    const start = target.selectionStart ?? target.value.length;
    const end   = target.selectionEnd   ?? target.value.length;
    if (mapped === 'Backspace') {
      target.value = target.value.slice(0, Math.max(0, start - (start === end ? 1 : 0))) + target.value.slice(end);
    } else if (mapped.length === 1) {
      target.value = target.value.slice(0, start) + mapped + target.value.slice(end);
      target.setSelectionRange(start + 1, start + 1);
    }
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }

  if (k === '⇧') { shiftOn = !shiftOn; updateLabels(); }
  if (k === '⇪') { capsOn = !capsOn; updateLabels(); }
}

function updateLabels(): void {
  document.querySelectorAll<HTMLButtonElement>(`[${ATTR}] [data-key]`).forEach(btn => {
    const k = btn.dataset.key!;
    if (!SPECIAL[k]) btn.textContent = keyLabel(k);
  });
}

export function show(): void {
  if (document.querySelector(`[${ATTR}]`)) return;

  const kb = document.createElement('div');
  kb.setAttribute(ATTR, '');
  Object.assign(kb.style, {
    position: 'fixed', bottom: '0', left: '0', width: '100%', maxWidth: '100vw',
    background: '#f0f4f0', borderTop: '2px solid #d0ddd0',
    padding: '8px 4px calc(12px + env(safe-area-inset-bottom))', zIndex: '9900',
    fontFamily: getConfig().uiFontFamily, boxSizing: 'border-box',
    userSelect: 'none', overflowX: 'hidden',
  });

  // Header row: drag pill + close button
  const headerRow = document.createElement('div');
  Object.assign(headerRow.style, {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    position: 'relative', marginBottom: '8px',
  });

  const pill = document.createElement('div');
  Object.assign(pill.style, {
    width: '40px', height: '4px', background: '#aac4a8', borderRadius: '2px',
  });

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close keyboard');
  closeBtn.textContent = '✕';
  Object.assign(closeBtn.style, {
    position: 'absolute', right: '8px', top: '-4px',
    width: '28px', height: '28px', borderRadius: '50%',
    border: '1.5px solid #d0ddd0', background: '#fff',
    cursor: 'pointer', fontSize: '14px', lineHeight: '1',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  });
  closeBtn.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('cc-vkb-close'));
  });

  headerRow.appendChild(pill);
  headerRow.appendChild(closeBtn);
  kb.appendChild(headerRow);

  ROWS.forEach(row => {
    const rowEl = document.createElement('div');
    Object.assign(rowEl.style, {
      display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '4px',
      overflowX: 'auto', paddingBottom: '2px',
    });
    row.forEach(k => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = keyLabel(k);
      btn.dataset.key = k;
      const wide = ['Space', 'Tab', '⇧', '⌫', '↵', '⇪'].includes(k);
      Object.assign(btn.style, {
        minWidth: k === 'Space' ? '160px' : wide ? '52px' : '32px',
        height: '40px', borderRadius: '6px',
        border: '1.5px solid #d0ddd0', background: '#fff',
        fontSize: '12px', cursor: 'pointer', padding: '0 4px',
        fontFamily: 'inherit', flexShrink: '0',
      });
      btn.addEventListener('mousedown', e => { e.preventDefault(); dispatchKey(k); });
      rowEl.appendChild(btn);
    });
    kb.appendChild(rowEl);
  });

  document.body.appendChild(kb);
}

export function hide(): void {
  document.querySelector(`[${ATTR}]`)?.remove();
  shiftOn = false;
  capsOn = false;
}
