import { FormFieldInstance, FormField, DetailsError } from './formField';
import { VueComponent } from './types';
import { Templates } from './template';
import * as DCommon from "@duplojs-v1/lang/common";
import type * as DDataStructure from "@duplojs-v1/lang/dataStructure";
import * as DEither from "@duplojs-v1/lang/either";
export interface InputTemplateProperties {
    props: {
        getLabel?(): string;
        getCurrentValue(): unknown;
        getErrorMessage?(): string | null;
        fieldKey: string;
    };
    slots: {
        input(): any;
    };
}
declare module "./template" {
    interface AllowedTemplateComponents {
        input: VueComponent<InputTemplateProperties>;
    }
}
export interface ExposeInputProperties {
    check?(): DCommon.MaybePromise<DEither.Error<DetailsError> | DEither.Success<unknown>>;
    reset?: FormFieldInstance["reset"];
    dispose?: FormFieldInstance["dispose"];
}
export type VueInputComponent = VueComponent<{
    props: {
        modelValue?: unknown;
    };
    emits: {
        "update:modelValue"(value: any): any;
    };
    expose: ExposeInputProperties;
}>;
export type GetVueInputComponentValue<GenericInputComponentInstance extends InstanceType<VueInputComponent>> = Exclude<GenericInputComponentInstance["$props"]["modelValue"], undefined>;
export type GetVueInputComponentProps<GenericInputComponentInstance extends InstanceType<VueInputComponent>> = DCommon.SimplifyTopLevel<Omit<GenericInputComponentInstance["$props"], "modelValue" | "onUpdate:modelValue" | "id" | "ref" | "key">>;
export type GetVueInputComponentCheckedValue<GenericInputComponentInstance extends InstanceType<VueInputComponent>> = GenericInputComponentInstance["check"] extends DCommon.AnyFunction ? DEither.GetValue<Extract<ReturnType<GenericInputComponentInstance["check"]>, DEither.Success>> : GetVueInputComponentValue<GenericInputComponentInstance>;
export type CreateInputParams<GenericInputComponentInstance extends InstanceType<VueInputComponent> = InstanceType<VueInputComponent>> = DCommon.SimplifyTopLevel<{
    defaultValue: (Exclude<GetVueInputComponentValue<GenericInputComponentInstance>, object | DCommon.AnyFunction> | (() => GetVueInputComponentValue<GenericInputComponentInstance>));
    template?: Templates["input"];
    codecs?: DDataStructure.Codecs;
} & (GetVueInputComponentProps<GenericInputComponentInstance> extends infer InferredProps ? {} extends InferredProps ? {
    props?: InferredProps;
} : {
    props: InferredProps;
} : never)>;
export interface UseInputParams<GenericInputComponentInstance extends InstanceType<VueInputComponent> = InstanceType<VueInputComponent>, GenericDataStructure extends DDataStructure.Structure = DDataStructure.Structure> {
    label?: DCommon.MayBeGetter<string>;
    defaultValue?: (Exclude<GetVueInputComponentValue<GenericInputComponentInstance>, object | DCommon.AnyFunction> | (() => GetVueInputComponentValue<GenericInputComponentInstance>));
    props?: DCommon.MayBeGetter<GetVueInputComponentProps<GenericInputComponentInstance>>;
    dataStructure?: GenericDataStructure;
    class?: string;
    template?: Templates["input"];
    codecs?: DDataStructure.Codecs;
}
export type UseInput<GenericInputComponentInstance extends InstanceType<VueInputComponent> = InstanceType<VueInputComponent>> = <GenericDataStructure extends DDataStructure.Structure = never>(params?: UseInputParams<GenericInputComponentInstance, GenericDataStructure>) => FormField<GetVueInputComponentValue<GenericInputComponentInstance>, DCommon.IsEqual<GenericDataStructure, never> extends true ? GetVueInputComponentCheckedValue<GenericInputComponentInstance> : DDataStructure.StructureValue<GenericDataStructure>, {}>;
export declare function createInput<GenericInputComponent extends VueInputComponent, GenericInputComponentInstance extends InstanceType<GenericInputComponent>>(inputComponent: GenericInputComponent, defaultParams: CreateInputParams<GenericInputComponentInstance>): UseInput<GenericInputComponentInstance>;
