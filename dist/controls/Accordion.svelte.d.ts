import type { Snippet } from 'svelte';
type $$ComponentProps = {
    title: string;
    activeCount?: number;
    startOpen?: boolean;
    icon: Snippet;
    children: Snippet;
};
declare const Accordion: import("svelte").Component<$$ComponentProps, {}, "">;
type Accordion = ReturnType<typeof Accordion>;
export default Accordion;
