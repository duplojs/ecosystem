import { FunctionalComponent, HTMLAttributes, Ref } from 'vue';
import { GetFormFieldCheckedValue, GetFormFieldValue, FormField, FormFieldInstance, GetFormFieldSlots, FormFieldSlots } from './formField';
import { Templates } from './template';
import { VueComponent } from './types';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DEither from "@duplojs-v1/lang/either";
import * as DDataStructure from "@duplojs-v1/lang/dataStructure";
export interface FormTemplateProperties {
    props: {
        fieldKey: string;
        getCurrentValue(): unknown;
    };
    emits: {
        submit: [];
    };
    slots: {
        formField(): any;
        submitter(): any;
    };
}
declare module "./template" {
    interface AllowedTemplateComponents {
        form: VueComponent<FormTemplateProperties>;
    }
}
export interface FormProperties<GenericFormField extends FormField = FormField> {
    check: FormFieldInstance<GetFormFieldCheckedValue<GenericFormField>>["check"];
    currentValue: Ref<GetFormFieldValue<GenericFormField>>;
    reset(): void;
    dispose(): void;
    component: FunctionalComponent<HTMLAttributes, {}, DCommon.SimplifyTopLevel<{
        default?(): any;
    } & (GetFormFieldSlots<GenericFormField> extends infer InferredSlots extends FormFieldSlots ? {
        [Prop in keyof InferredSlots]: (params: InferredSlots[Prop]) => any;
    } : {})>>;
}
export interface UseFormParams {
    class?: string;
    template?: Templates["form"];
    errorInterpreter?: DDataStructure.ErrorInterpreter;
    codecs?: DDataStructure.Codecs;
}
export type UseForm = <GenericFormField extends FormField>(formField: GenericFormField, params?: UseFormParams) => FormProperties<GenericFormField>;
export declare function createForm(templates: Templates): UseForm;
export type GetCheckedValue<GenericCheck extends FormProperties["check"]> = DEither.GetValue<Extract<Awaited<ReturnType<GenericCheck>>, DEither.Right>>;
