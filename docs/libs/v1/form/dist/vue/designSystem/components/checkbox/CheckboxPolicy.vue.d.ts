import { ExposeInputProperties } from '../../../input';
export interface Props {
    id: string;
    name?: string;
    title?: string;
    description?: string;
    required?: boolean;
    errorMessage?: string;
}
type __VLS_Props = Props;
type __VLS_ModelProps = {
    modelValue?: boolean;
};
type __VLS_PublicProps = __VLS_Props & __VLS_ModelProps;
declare const __VLS_export: import('vue').DefineComponent<__VLS_PublicProps, ExposeInputProperties, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    "update:modelValue": (value: boolean) => any;
}, string, import('vue').PublicProps, Readonly<__VLS_PublicProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: boolean) => any) | undefined;
}>, {
    errorMessage: string;
}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const _default: typeof __VLS_export;
export default _default;
