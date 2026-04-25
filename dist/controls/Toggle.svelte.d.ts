type $$ComponentProps = {
    label: string;
    desc?: string;
    value?: boolean;
    onchange?: (v: boolean) => void;
};
declare const Toggle: import("svelte").Component<$$ComponentProps, {}, "">;
type Toggle = ReturnType<typeof Toggle>;
export default Toggle;
