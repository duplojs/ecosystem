import { VNode } from 'vue';
import { GetFormFieldCheckedValue, GetFormFieldValue, FormField, MergeFormFieldSlots } from '../formField';
import { VueComponent } from '../types';
import { Templates } from '../template';
export interface MultiTemplateProperties {
    props: {
        fieldKey: string;
        getCurrentValue(): unknown;
        getFormFields(): (VNode | null)[];
    };
    slots: {
        formField(): any;
    };
}
declare module '../template' {
    interface AllowedTemplateComponents {
        multi: VueComponent<MultiTemplateProperties>;
    }
}
export type FormFieldWrapper = Record<string, FormField>;
export type FormFieldEntry = [
    string,
    FormField
];
export interface UseMultiFieldLayoutParams {
    class?: string;
    template?: Templates["multi"];
}
export declare function useMultiLayout<GenericFormFieldWrapper extends FormFieldWrapper>(formFieldWrapper: GenericFormFieldWrapper, params?: UseMultiFieldLayoutParams): FormField<{
    [Prop in keyof GenericFormFieldWrapper]: GetFormFieldValue<GenericFormFieldWrapper[Prop]>;
}, {
    [Prop in keyof GenericFormFieldWrapper]: GetFormFieldCheckedValue<GenericFormFieldWrapper[Prop]>;
}, MergeFormFieldSlots<GenericFormFieldWrapper[keyof GenericFormFieldWrapper]>>;
export declare function useMultiLayout<GenericFormFieldEntry extends FormFieldEntry>(formFieldEntries: GenericFormFieldEntry[], params?: UseMultiFieldLayoutParams): FormField<{
    [Entry in GenericFormFieldEntry as string]: GetFormFieldValue<Entry[1]>;
}, {
    [Entry in GenericFormFieldEntry as string]: GetFormFieldCheckedValue<Entry[1]>;
}, MergeFormFieldSlots<GenericFormFieldEntry[1]>>;
