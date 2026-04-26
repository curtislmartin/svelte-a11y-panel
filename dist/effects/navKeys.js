let handler = null;
let hIdx = -1, bIdx = -1, fIdx = -1;
function queryVisible(selector) {
    return Array.from(document.querySelectorAll(selector))
        .filter(el => !el.closest('[data-a11y-panel-host]') && el.offsetParent !== null);
}
export function start() {
    if (handler)
        return;
    hIdx = -1;
    bIdx = -1;
    fIdx = -1;
    handler = (e) => {
        const active = document.activeElement;
        if (active && (['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName) || active.isContentEditable))
            return;
        switch (e.key.toUpperCase()) {
            case 'H': {
                e.preventDefault();
                const headings = queryVisible('h1,h2,h3,h4,h5,h6');
                if (!headings.length)
                    return;
                hIdx = (hIdx + 1) % headings.length;
                headings[hIdx].setAttribute('tabindex', headings[hIdx].tabIndex < 0 ? '-1' : String(headings[hIdx].tabIndex));
                headings[hIdx].focus({ preventScroll: true });
                headings[hIdx].scrollIntoView({ block: 'center', behavior: 'smooth' });
                break;
            }
            case 'B': {
                e.preventDefault();
                const buttons = queryVisible('button:not([disabled])');
                if (!buttons.length)
                    return;
                bIdx = (bIdx + 1) % buttons.length;
                buttons[bIdx].focus({ preventScroll: true });
                buttons[bIdx].scrollIntoView({ block: 'center', behavior: 'smooth' });
                break;
            }
            case 'F': {
                e.preventDefault();
                const inputs = queryVisible('input:not([type=hidden]),select,textarea');
                if (!inputs.length)
                    return;
                fIdx = (fIdx + 1) % inputs.length;
                inputs[fIdx].focus({ preventScroll: true });
                inputs[fIdx].scrollIntoView({ block: 'center', behavior: 'smooth' });
                break;
            }
            case 'G':
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                break;
            case 'M': {
                e.preventDefault();
                const main = document.querySelector('main,[role=main]');
                if (main) {
                    main.setAttribute('tabindex', '-1');
                    main.focus({ preventScroll: true });
                    main.scrollIntoView({ behavior: 'smooth' });
                }
                break;
            }
        }
    };
    document.addEventListener('keydown', handler);
}
export function stop() {
    if (handler) {
        document.removeEventListener('keydown', handler);
        handler = null;
    }
    hIdx = -1;
    bIdx = -1;
    fIdx = -1;
}
