// Shared validators for values that end up inside injected CSS.
export const CSS_COLOR_RE = /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%\s*,\s*\d{1,3}%\s*\))$/;
// Font stacks: family names (quoted or not) separated by commas. No braces,
// semicolons, parens, or slashes — blocks url(), @import, and rule breakout.
const FONT_FAMILY_RE = /^[a-zA-Z0-9\s,'"-]+$/;
export function safeColor(val, fallback) {
    return CSS_COLOR_RE.test(val.trim()) ? val.trim() : fallback;
}
export function safeFontFamily(val, fallback) {
    return FONT_FAMILY_RE.test(val.trim()) ? val.trim() : fallback;
}
