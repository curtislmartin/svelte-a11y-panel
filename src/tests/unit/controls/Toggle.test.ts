import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Toggle from '$lib/controls/Toggle.svelte';

describe('Toggle', () => {
  it('renders with label', () => {
    const { getByText } = render(Toggle, { props: { label: 'Dark Mode', value: false } });
    expect(getByText('Dark Mode')).toBeTruthy();
  });

  it('renders description when provided', () => {
    const { getByText } = render(Toggle, { props: { label: 'X', desc: 'Some description', value: false } });
    expect(getByText('Some description')).toBeTruthy();
  });

  it('switch has aria-checked=false when value is false', () => {
    const { getByRole } = render(Toggle, { props: { label: 'X', value: false } });
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('switch has aria-checked=true when value is true', () => {
    const { getByRole } = render(Toggle, { props: { label: 'X', value: true } });
    expect(getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('fires onchange with toggled value on click', async () => {
    const onchange = vi.fn();
    const { getByRole } = render(Toggle, { props: { label: 'X', value: false, onchange } });
    await fireEvent.click(getByRole('switch'));
    expect(onchange).toHaveBeenCalledWith(true);
  });

  it('fires onchange on Space key', async () => {
    const onchange = vi.fn();
    const { getByRole } = render(Toggle, { props: { label: 'X', value: false, onchange } });
    await fireEvent.keyDown(getByRole('switch'), { key: ' ' });
    expect(onchange).toHaveBeenCalledWith(true);
  });

  it('fires onchange on Enter key', async () => {
    const onchange = vi.fn();
    const { getByRole } = render(Toggle, { props: { label: 'X', value: false, onchange } });
    await fireEvent.keyDown(getByRole('switch'), { key: 'Enter' });
    expect(onchange).toHaveBeenCalledWith(true);
  });
});
