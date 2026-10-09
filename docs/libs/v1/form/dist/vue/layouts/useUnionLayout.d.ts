import { FormField, GetFormFieldCheckedValue, GetFormFieldValue, MergeFormFieldSlots } from '../formField';
import { Templates } from '../template';
import { VueComponent } from '../types';
import * as DCommon from "@duplojs-v1/lang/common";
export interface UnionTemplateProperties {
    props: {
        fieldKey: string;
        kinds: string[];
        getCurrentValue(): unknown;
        getCurrentKind(): string;
    };
    emits: {
        changeKind: [kind: string];
    };
    slots: {
        formField(): any;
    };
}
declare module '../template' {
    interface AllowedTemplateComponents {
        union: VueComponent<UnionTemplateProperties>;
    }
}
export interface UseUnionLayoutParams<GenericKind extends string = string> {
    defaultKind: GenericKind;
    class?: string;
    template?: Templates["union"];
}
export type FormFieldUnionElement = [string, FormField];
export declare function useUnionLayout<const GenericFormFieldElements extends DCommon.AnyTuple<FormFieldUnionElement>>(formFieldUnionElements: GenericFormFieldElements, params: UseUnionLayoutParams<GenericFormFieldElements[number][0]>): FormField<Extract<GenericFormFieldElements[number], any> extends infer InferredFormFieldElements extends FormFieldUnionElement ? InferredFormFieldElements extends FormFieldUnionElement ? {
    readonly kind: InferredFormFieldElements[0];
    value: GetFormFieldValue<InferredFormFieldElements[1]>;
    updateKind(kind: GenericFormFieldElements[number][0]): void;
    updateKind<GenericKind extends GenericFormFieldElements[number][0]>(kind: GenericKind, value: GetFormFieldValue<Extract<GenericFormFieldElements[number], [
        GenericKind,
        any
    ]>[1]>): void;
} : never : never, GenericFormFieldElements[number] extends infer InferredFormFieldElements extends FormFieldUnionElement ? InferredFormFieldElements extends FormFieldUnionElement ? {
    kind: InferredFormFieldElements[0];
    value: GetFormFieldCheckedValue<InferredFormFieldElements[1]>;
} : never : never, MergeFormFieldSlots<GenericFormFieldElements[number][1]>>;
