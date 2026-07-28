import { getConfig } from './effects/config';
function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}
// Keep at least this much of the panel reachable when restoring a saved position
const EDGE_MARGIN = 60;
function clampToViewport(p) {
    return {
        x: clamp(p.x, 0, Math.max(0, window.innerWidth - EDGE_MARGIN)),
        y: clamp(p.y, 0, Math.max(0, window.innerHeight - EDGE_MARGIN)),
    };
}
function loadPos() {
    try {
        const saved = sessionStorage.getItem(getConfig().positionKey);
        if (saved) {
            const p = JSON.parse(saved);
            if (typeof p?.x === 'number' && isFinite(p.x) && typeof p?.y === 'number' && isFinite(p.y)) {
                return clampToViewport({ x: p.x, y: p.y });
            }
        }
    }
    catch { /* ignore */ }
    return clampToViewport({ x: window.innerWidth - 450, y: 80 });
}
function savePos(pos) {
    try {
        sessionStorage.setItem(getConfig().positionKey, JSON.stringify(pos));
    }
    catch { /* ignore */ }
}
export function useDrag(getPanelEl) {
    let pos = { x: 0, y: 0 };
    function applyPos(p) {
        const el = getPanelEl();
        if (!el)
            return;
        el.style.left = `${p.x}px`;
        el.style.top = `${p.y}px`;
        el.style.right = 'auto';
        el.style.bottom = 'auto';
    }
    function init() {
        pos = loadPos();
        applyPos(pos);
    }
    function startDrag(e) {
        const el = getPanelEl();
        if (!el)
            return;
        const rect = el.getBoundingClientRect();
        const offX = e.clientX - rect.left;
        const offY = e.clientY - rect.top;
        function onMove(ev) {
            const newPos = {
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
