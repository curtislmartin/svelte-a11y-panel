import { getConfig } from './config';

const ATTR = 'data-a11y-panel-link-nav';

function build(onClose: () => void): void {
  document.querySelector(`[${ATTR}]`)?.remove();

  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
    .filter(a => !a.closest('[data-a11y-panel-host]') && a.innerText.trim());

  const dialog = document.createElement('dialog');
  dialog.setAttribute(ATTR, '');
  Object.assign(dialog.style, {
    padding: '0', border: `2px solid ${getConfig().accentColor}`, borderRadius: '12px',
    overflow: 'hidden', fontFamily: getConfig().uiFontFamily,
    width: 'min(90vw, 500px)', maxHeight: '70vh', display: 'flex',
    flexDirection: 'column', background: '#fff', color: '#1a1a1a',
  });

  // Build header
  const header = document.createElement('div');
  Object.assign(header.style, {
    padding: '12px 16px', borderBottom: '1px solid #d0ddd0',
    display: 'flex', gap: '8px', alignItems: 'center', flexShrink: '0',
  });

  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = `Filter ${links.length} links…`;
  input.setAttribute('aria-label', 'Filter page links');
  Object.assign(input.style, {
    flex: '1', padding: '8px 12px', border: '1.5px solid #d0ddd0',
    borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit', outline: 'none',
    background: '#fff', color: '#1a1a1a',
  });

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close link navigator');
  closeBtn.textContent = '✕';
  Object.assign(closeBtn.style, {
    width: '32px', height: '32px', borderRadius: '50%',
    border: '1.5px solid #d0ddd0', background: '#fff',
    cursor: 'pointer', fontSize: '16px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: '0',
  });

  header.appendChild(input);
  header.appendChild(closeBtn);
  dialog.appendChild(header);

  // Build list
  const ul = document.createElement('ul');
  Object.assign(ul.style, {
    margin: '0', padding: '8px 0', listStyle: 'none',
    overflowY: 'auto', flex: '1',
  });

  links.forEach((a, i) => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = a.innerText.trim().slice(0, 80);
    btn.dataset.linkIdx = String(i);
    Object.assign(btn.style, {
      width: '100%', padding: '10px 16px', border: 'none',
      background: 'none', textAlign: 'left', cursor: 'pointer',
      fontFamily: 'inherit', fontSize: '14px', color: getConfig().accentColor,
      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
    });
    btn.addEventListener('click', () => {
      close();
      links[i]?.focus();
    });
    li.appendChild(btn);
    ul.appendChild(li);
  });

  dialog.appendChild(ul);
  document.body.appendChild(dialog);
  dialog.showModal();

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    ul.querySelectorAll<HTMLElement>('li').forEach(li => {
      li.style.display = li.textContent!.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  function close() {
    dialog.close();
    dialog.remove();
    onClose();
  }

  closeBtn.addEventListener('click', close);
  dialog.addEventListener('cancel', close);

  input.focus();
}

export function open(onClose: () => void): void { build(onClose); }

export function close(): void {
  const el = document.querySelector<HTMLDialogElement>(`[${ATTR}]`);
  if (el) { el.close(); el.remove(); }
}
