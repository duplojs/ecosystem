export { default as TheCheckbox } from './TheCheckbox.vue';
export { default as CheckboxPolicy } from './CheckboxPolicy.vue';
export declare const useCheckbox: import('../../../input').UseInput<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./TheCheckbox.vue').Props & {
    modelValue?: boolean;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
}, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<import('./TheCheckbox.vue').Props & {
    modelValue?: boolean;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {}, {}, {}, {}, {}>>;
export declare const useCheckboxPolicy: import('../../../input').UseInput<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./CheckboxPolicy.vue').Props & {
    modelValue?: boolean;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, import('../../../input').ExposeInputProperties, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
}, import('vue').PublicProps, {
    errorMessage: string;
}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<import('./CheckboxPolicy.vue').Props & {
    modelValue?: boolean;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, import('../../../input').ExposeInputProperties, {}, {}, {}, {
    errorMessage: string;
}>>;
