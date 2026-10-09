import type * as DCommon from '../../../common';
export type ComplexUnMatchedFunction<GenericInput extends unknown, GenericPatternValue extends unknown> = ([
    Extract<GenericInput, DCommon.AnyFunction>,
    Extract<GenericPatternValue, DCommon.AnyFunction>
] extends [
    infer inferredInput,
    infer inferredPatternValue
] ? Exclude<inferredInput, inferredPatternValue> : never);
