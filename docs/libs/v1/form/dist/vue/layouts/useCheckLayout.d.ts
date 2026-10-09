import { GetFormFieldCheckedValue, FormField, GetFormFieldValue, GetFormFieldSlots } from '../formField';
import { VueComponent } from '../types';
import { Templates } from '../template';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
export interface CheckTemplateProperties {
    props: {
        fieldKey: string;
        getCurrentValue(): unknown;
        getErrorMessage(): string | null;
    };
    slots: {
        formField(): any;
    };
}
declare module '../template' {
    interface AllowedTemplateComponents {
        check: VueComponent<CheckTemplateProperties>;
    }
}
export interface UseCheckLayoutParams<GenericDataStructure extends DDataStructure.Structure = DDataStructure.Structure, GenericCheckedValue extends unknown = unknown> {
    dataStructure?: GenericDataStructure;
    refine?(value: GenericCheckedValue): DCommon.MaybePromise<DEither.Ok | DEither.Error<string>>;
    class?: string;
    template?: Templates["check"];
    codecs?: DDataStructure.Codecs;
}
export declare function useCheckLayout<GenericFormField extends FormField, GenericDataStructure extends DDataStructure.Structure = never>(formField: GenericFormField, params: UseCheckLayoutParams<GenericDataStructure, GetFormFieldCheckedValue<GenericFormField>>): FormField<GetFormFieldValue<GenericFormField>, DCommon.IsEqual<GenericDataStructure, never> extends true ? GetFormFieldCheckedValue<GenericFormField> : DDataStructure.StructureValue<GenericDataStructure>, GetFormFieldSlots<GenericFormField>>;
