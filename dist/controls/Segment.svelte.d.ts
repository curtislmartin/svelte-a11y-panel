type $$ComponentProps = {
    label: string;
    value: string | null;
    opts: {
        val: string;
        label: string;
    }[];
    onchange?: (v: string | null) => void;
};
declare const Segment: import("svelte").Component<$$ComponentProps, {}, "">;
type Segment = ReturnType<typeof Segment>;
export default Segment;
