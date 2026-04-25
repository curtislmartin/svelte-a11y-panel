import { DEFAULT_STATE } from '../types';
import { getConfig } from './config';
let saveTimer = null;
export function save(state) {
    if (saveTimer)
        clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        try {
            localStorage.setItem(getConfig().storageKey, JSON.stringify(state));
        }
        catch { }
    }, 300);
}
export function load() {
    try {
        const raw = localStorage.getItem(getConfig().storageKey);
        if (!raw)
            return { ...DEFAULT_STATE };
        return { ...DEFAULT_STATE, ...JSON.parse(raw) };
    }
    catch {
        return { ...DEFAULT_STATE };
    }
}
export function clear() {
    if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = null;
    }
    localStorage.removeItem(getConfig().storageKey);
}
