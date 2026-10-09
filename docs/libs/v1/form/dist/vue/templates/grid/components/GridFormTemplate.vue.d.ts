import { FormTemplateProperties } from '../../../form';
import { GridTemplateContainerProps } from '../types';
export type Props = (FormTemplateProperties["props"] & GridTemplateContainerProps);
type __VLS_Slots = FormTemplateProperties["slots"];
declare const __VLS_base: import('vue').DefineComponent<Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    submit: () => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    onSubmit?: (() => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
