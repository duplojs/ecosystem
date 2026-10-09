import { FunctionSelectInputComponent } from '../../types';
export * from './icons';
export * from './button';
export * from './checkbox';
export * from './range';
export * from './date';
export * from './time';
export { default as SelectInput } from './SelectInput.vue';
export { default as NumberInput } from './NumberInput.vue';
export { default as RadioGroup } from './RadioGroup.vue';
export { default as TextInput } from './TextInput.vue';
export { default as TextareaInput } from './TextareaInput.vue';
export { default as FileInput } from './FileInput.vue';
export declare const templateFormSelect: FunctionSelectInputComponent;
export declare const useFileInput: import('../../input').UseInput<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./FileInput.vue').Props & {
    modelValue?: File[] | null;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: File[] | null | undefined) => any) | undefined;
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: File[] | null | undefined) => any;
}, import('vue').PublicProps, {
    multiple: boolean;
}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<import('./FileInput.vue').Props & {
    modelValue?: File[] | null;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: File[] | null | undefined) => any) | undefined;
}>, {}, {}, {}, {}, {
    multiple: boolean;
}>>;
export declare const useNumberInput: import('../../input').UseInput<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./NumberInput.vue').Props & {
    modelValue: number;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: number) => any) | undefined;
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: number) => any;
}, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<import('./NumberInput.vue').Props & {
    modelValue: number;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: number) => any) | undefined;
}>, {}, {}, {}, {}, {}>>;
export declare const useRadioGroup: import('../../input').UseInput<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./RadioGroup.vue').Props & {
    modelValue?: string | null;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | null | undefined) => any) | undefined;
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string | null | undefined) => any;
}, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<import('./RadioGroup.vue').Props & {
    modelValue?: string | null;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | null | undefined) => any) | undefined;
}>, {}, {}, {}, {}, {}>>;
export declare const useSelectInput: import('../../input').UseInput<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./SelectInput.vue').Props & {
    modelValue?: string | null;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | null) => any) | undefined;
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string | null) => any;
}, import('vue').PublicProps, {
    fieldKey: string;
}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<import('./SelectInput.vue').Props & {
    modelValue?: string | null;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | null) => any) | undefined;
}>, {}, {}, {}, {}, {
    fieldKey: string;
}>>;
export declare const useTextareaInput: import('../../input').UseInput<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./TextareaInput.vue').Props & {
    modelValue?: string;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string | undefined) => any;
}, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<import('./TextareaInput.vue').Props & {
    modelValue?: string;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {}, {}, {}, {}, {}>>;
export declare const useTextInput: import('../../input').UseInput<import('vue').CreateComponentPublicInstanceWithMixins<Readonly<import('./TextInput.vue').Props & {
    modelValue?: string;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: string | undefined) => any;
}, import('vue').PublicProps, {}, false, {}, {}, import('vue').GlobalComponents, import('vue').GlobalDirectives, string, {}, any, import('vue').ComponentProvideOptions, {
    P: {};
    B: {};
    D: {};
    C: {};
    M: {};
    Defaults: {};
}, Readonly<import('./TextInput.vue').Props & {
    modelValue?: string;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {}, {}, {}, {}, {}>>;
