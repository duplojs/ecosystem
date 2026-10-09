import * as DChrono from "@duplojs-v1/lang/chrono";
export interface Props {
    min?: DChrono.TheTime | DChrono.SerializedTheTime;
    max?: DChrono.TheTime | DChrono.SerializedTheTime;
}
type __VLS_Props = Props;
type __VLS_ModelProps = {
    modelValue?: DChrono.TheTime | DChrono.SerializedTheTime | null;
};
type __VLS_PublicProps = __VLS_Props & __VLS_ModelProps;
declare const __VLS_export: import('vue').DefineComponent<__VLS_PublicProps, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: DChrono.TheTime | `time${number}-` | `time${number}+` | null | undefined) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: DChrono.TheTime | `time${number}-` | `time${number}+` | null | undefined) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
