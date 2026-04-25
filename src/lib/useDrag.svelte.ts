import { getConfig } from './effects/config';

interface Pos { x: number; y: number }

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function loadPos(): Pos {
  try {
    const saved = sessionStorage.getItem(getConfig().positionKey);
    if (saved) return JSON.parse(saved) as Pos;
  } catch { /* ignore */ }
  return { x: window.innerWidth - 450, y: 80 };
}

function savePos(pos: Pos) {
  try { sessionStorage.setItem(getConfig().positionKey, JSON.stringify(pos)); } catch { /* ignore */ }
}

export function useDrag(getPanelEl: () => HTMLElement | null) {
  let pos: Pos = { x: 0, y: 0 };

  function applyPos(p: Pos) {
    const el = getPanelEl();
    if (!el) return;
    el.style.left = `${p.x}px`;
    el.style.top = `${p.y}px`;
    el.style.right = 'auto';
    el.style.bottom = 'auto';
  }

  function init() {
    pos = loadPos();
    applyPos(pos);
  }

  function startDrag(e: PointerEvent) {
    const el = getPanelEl();
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offX = e.clientX - rect.left;
    const offY = e.clientY - rect.top;

    function onMove(ev: PointerEvent) {
      const newPos: Pos = {
        x: clamp(ev.clientX - offX, 0, window.innerWidth - rect.width),
        y: clamp(ev.clientY - offY, 0, window.innerHeight - rect.height),
      };
      pos = newPos;
      applyPos(newPos);
    }

    function onUp() {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      savePos(pos);
    }

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  return { init, startDrag };
}
