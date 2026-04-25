import { DEFAULT_CONFIG } from '../config';
let current = structuredClone(DEFAULT_CONFIG);
export function setConfig(cfg) {
    current = {
        ...DEFAULT_CONFIG,
        ...cfg,
        statement: { ...DEFAULT_CONFIG.statement, ...cfg.statement },
    };
}
export function getConfig() {
    return current;
}
