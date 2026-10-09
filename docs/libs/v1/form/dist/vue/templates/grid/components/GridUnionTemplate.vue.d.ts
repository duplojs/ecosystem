import { UnionTemplateProperties } from '../../../layouts';
import { GridTemplateLayoutContainerProps } from '../types';
import { FunctionSelectInputComponent } from '../../../types';
export type Props = (UnionTemplateProperties["props"] & GridTemplateLayoutContainerProps & {
    labels?: Record<string, string>;
    selectInputKind: FunctionSelectInputComponent;
});
type __VLS_Slots = UnionTemplateProperties["slots"];
declare const __VLS_base: import('vue').DefineComponent<Props, {}, {}, {}, {}, import('vue').ComponentOptionsMixin, import('vue').ComponentOptionsMixin, {
    changeKind: (kind: string) => any;
}, string, import('vue').PublicProps, Readonly<Props> & Readonly<{
    onChangeKind?: ((kind: string) => any) | undefined;
}>, {}, {}, {}, {}, string, import('vue').ComponentProvideOptions, false, {}, any>;
declare const __VLS_export: __VLS_WithSlots<typeof __VLS_base, __VLS_Slots>;
declare const _default: typeof __VLS_export;
export default _default;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
