type $$ComponentProps = {
    label: string;
    desc?: string;
    display: string;
    ondec?: () => void;
    oninc?: () => void;
    atMin?: boolean;
    atMax?: boolean;
};
declare const Stepper: import("svelte").Component<$$ComponentProps, {}, "">;
type Stepper = ReturnType<typeof Stepper>;
export default Stepper;
