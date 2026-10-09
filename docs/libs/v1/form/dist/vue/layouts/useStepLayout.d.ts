import { VNode } from 'vue';
import { GetFormFieldCheckedValue, FormField, GetFormFieldValue, MergeFormFieldSlots } from '../formField';
import { VueComponent } from '../types';
import { Templates } from '../template';
import * as DCommon from "@duplojs-v1/lang/common";
export interface StepTemplateProperties {
    props: {
        fieldKey: string;
        stepQuantity: number;
        isLastStep(): boolean;
        getFormFields(): (() => (VNode | null))[];
        getCurrentValue(): unknown;
        getCurrentStep(): number;
        getErrorMessageNotAtLastStep(): null | string;
    };
    emits: {
        nextStep: [];
        previousStep: [];
        resetStep: [];
    };
    slots: {
        formField(): any;
    };
}
declare module '../template' {
    interface AllowedTemplateComponents {
        step: VueComponent<StepTemplateProperties>;
    }
}
export interface UseStepLayoutParams {
    errorMessageNotAtLastStep: string;
    class?: string;
    template?: Templates["step"];
}
export declare function useStepLayout<const GenericFormFields extends DCommon.AnyTuple<FormField>>(formFields: GenericFormFields, params: UseStepLayoutParams): FormField<{
    currentStep: Exclude<keyof GenericFormFields, keyof any[]> extends `${infer InferredStep extends number}` ? InferredStep : never;
    steps: {
        -readonly [Prop in keyof GenericFormFields]: GetFormFieldValue<Extract<GenericFormFields[Prop], FormField>>;
    };
}, {
    [Prop in keyof GenericFormFields]: GetFormFieldCheckedValue<GenericFormFields[Prop]>;
}, MergeFormFieldSlots<GenericFormFields[number]>>;
