export { default as DualRangeInput } from './DualRangeInput.vue';
export { default as RangeInput } from './RangeInput.vue';
export declare const useRangeInput: import('../../../input').UseInput<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./RangeInput.vue').Props & {
    modelValue: number;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: number) => any) | undefined;
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: number) => any;
}, import('vue').PublicProps, {
    step: number;
    max: number;
    min: number;
    manual: boolean;
    manualDebounce: number;
}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<import('./RangeInput.vue').Props & {
    modelValue: number;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: number) => any) | undefined;
}>, {}, {}, {}, {}, {
    step: number;
    max: number;
    min: number;
    manual: boolean;
    manualDebounce: number;
}>>;
export declare const useDualRangeInput: import('../../../input').UseInput<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./DualRangeInput.vue').Props & {
    modelValue: import('./DualRangeInput.vue').Model;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: import('./DualRangeInput.vue').Model) => any) | undefined;
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: import('./DualRangeInput.vue').Model) => any;
}, import('vue').PublicProps, {
    step: number;
    max: number;
    min: number;
    manual: boolean;
    manualDebounce: number;
}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<import('./DualRangeInput.vue').Props & {
    modelValue: import('./DualRangeInput.vue').Model;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: import('./DualRangeInput.vue').Model) => any) | undefined;
}>, {}, {}, {}, {}, {
    step: number;
    max: number;
    min: number;
    manual: boolean;
    manualDebounce: number;
}>>;
