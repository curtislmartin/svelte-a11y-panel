import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import AccessibilityButton from '$lib/AccessibilityButton.svelte';

describe('AccessibilityButton accentColor sanitization', () => {
  it('applies a valid accentColor to the button background', () => {
    const { getByRole } = render(AccessibilityButton, { props: { accentColor: '#ff0000' } });
    expect(getByRole('button').getAttribute('style')).toMatch(/#ff0000|rgb\(255, 0, 0\)/);
  });

  it('falls back to the default colour on CSS injection attempt', () => {
    const { getByRole } = render(AccessibilityButton, {
      props: { accentColor: 'red; background-image: url(https://evil.example/x)' },
    });
    const style = getByRole('button').getAttribute('style') ?? '';
    expect(style).not.toContain('url(');
    expect(style).toMatch(/#2563eb|rgb\(37, 99, 235\)/);
  });
});
