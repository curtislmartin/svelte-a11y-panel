import type { PanelState } from '../types';
import { DEFAULT_STATE } from '../types';
import { getConfig } from './config';

let saveTimer: ReturnType<typeof setTimeout> | null = null;

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
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function clear(): void {
  if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
  localStorage.removeItem(getConfig().storageKey);
}
