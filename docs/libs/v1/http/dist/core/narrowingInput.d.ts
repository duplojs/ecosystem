import type * as DCommon from "@duplojs-v1/lang/common";
export interface NarrowingInput<GenericKey extends DCommon.ObjectKey = DCommon.ObjectKey, GenericValue extends unknown = unknown> {
    inputName: GenericKey;
    value: GenericValue;
}
export type ShrinkerInput<GenericDefinition extends object = object> = DCommon.SimplifyTopLevel<{
    [DPattern in keyof GenericDefinition]: (value: GenericDefinition[DPattern]) => NarrowingInput<DPattern, GenericDefinition[DPattern]>;
}>;
export type GetNarrowingInput<GenericInput extends ShrinkerInput, GenericKey extends keyof GenericInput = keyof GenericInput> = ReturnType<GenericInput[GenericKey] extends DCommon.AnyFunction ? GenericInput[GenericKey] : never>;
export declare function createNarrowingInput<GenericDefinition extends object>(): ShrinkerInput<GenericDefinition>;
