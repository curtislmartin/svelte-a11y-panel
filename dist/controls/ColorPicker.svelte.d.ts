type $$ComponentProps = {
    label: string;
    value: string;
    onchange?: (v: string) => void;
};
declare const ColorPicker: import("svelte").Component<$$ComponentProps, {}, "">;
type ColorPicker = ReturnType<typeof ColorPicker>;
export default ColorPicker;
