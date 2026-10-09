import { VNode } from 'vue';
import { VueComponent } from '../types';
import { Templates } from '../template';
import { FormField, GetFormFieldCheckedValue, GetFormFieldValue, GetFormFieldSlots } from '../formField';
import type * as DTuple from "@duplojs-v1/lang/tuple";
export interface RepeatTemplateProperties {
    props: {
        fieldKey: string;
        max: number;
        min: number;
        getFormFieldsQuantity(): number;
        getCurrentValue(): unknown;
        getFormFields(): (VNode | null)[];
    };
    emits: {
        addElement: [];
        removeElement: [index: number];
        resetElement: [index: number];
    };
    slots: {
        formField(): any;
    };
}
declare module '../template' {
    interface AllowedTemplateComponents {
        repeat: VueComponent<RepeatTemplateProperties>;
    }
}
export interface UseRepeatLayoutParams<GenericMin extends number = number> {
    max: number;
    min?: GenericMin;
    class?: string;
    template?: Templates["repeat"];
}
export declare function useRepeatLayout<GenericFormField extends FormField, GenericMin extends number = 0>(formField: GenericFormField, params: UseRepeatLayoutParams<GenericMin>): FormField<[
    ...DTuple.Create<GetFormFieldValue<GenericFormField>, GenericMin>,
    ...GetFormFieldValue<GenericFormField>[]
], [
    ...DTuple.Create<GetFormFieldCheckedValue<GenericFormField>, GenericMin>,
    ...GetFormFieldCheckedValue<GenericFormField>[]
], GetFormFieldSlots<GenericFormField>>;
