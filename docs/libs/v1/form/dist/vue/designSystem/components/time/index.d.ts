import * as DChrono from "@duplojs-v1/lang/chrono";
export { default as TimeInput } from './TimeInput.vue';
export { default as RangeTimeInput } from './RangeTimeInput.vue';
declare module "@vue/reactivity" {
    interface RefUnwrapBailTypes {
        duplojsTime: DChrono.TheTime;
    }
}
export declare const useTimeInput: import('../../../input').UseInput<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./TimeInput.vue').Props & {
    modelValue?: DChrono.TheTime | DChrono.SerializedTheTime | null;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: DChrono.TheTime | `time${number}-` | `time${number}+` | null | undefined) => any) | undefined;
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: DChrono.TheTime | `time${number}-` | `time${number}+` | null | undefined) => any;
}, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<import('./TimeInput.vue').Props & {
    modelValue?: DChrono.TheTime | DChrono.SerializedTheTime | null;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: DChrono.TheTime | `time${number}-` | `time${number}+` | null | undefined) => any) | undefined;
}>, {}, {}, {}, {}, {}>>;
export declare const useRangeTimeInput: import('../../../input').UseInput<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./RangeTimeInput.vue').Props & {
    modelValue?: import('./RangeTimeInput.vue').Model;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: import('./RangeTimeInput.vue').Model) => any) | undefined;
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: import('./RangeTimeInput.vue').Model) => any;
}, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<import('./RangeTimeInput.vue').Props & {
    modelValue?: import('./RangeTimeInput.vue').Model;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: import('./RangeTimeInput.vue').Model) => any) | undefined;
}>, {}, {}, {}, {}, {}>>;
