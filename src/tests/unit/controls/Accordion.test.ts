import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { tick } from 'svelte';
import AccordionTest from './AccordionTest.svelte';

describe('Accordion', () => {
  it('is collapsed by default', () => {
    const { queryByText } = render(AccordionTest, { props: { startOpen: false } });
    expect(queryByText('Child content')).toBeNull();
  });

  it('is open when startOpen=true', () => {
    const { getByText } = render(AccordionTest, { props: { startOpen: true } });
    expect(getByText('Child content')).toBeTruthy();
  });

  it('toggles open on trigger click', async () => {
    const { getByRole, queryByText } = render(AccordionTest, { props: { startOpen: false } });
    const trigger = getByRole('button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await fireEvent.click(trigger);
    await tick();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(queryByText('Child content')).toBeTruthy();
  });
});
