import { Pattern, ToolPattern } from './types';
import type * as DCommon from '../common';
export declare function union<GenericInput extends unknown, const GenericPatterns extends readonly [
    Pattern<GenericInput extends infer InferredInput ? InferredInput : never>,
    ...Pattern<GenericInput extends infer InferredInput ? InferredInput : never>[]
]>(...patterns: DCommon.FixDeepFunctionInfer<readonly [Pattern<GenericInput>, ...Pattern<GenericInput>[]], GenericPatterns>): ToolPattern<GenericInput, GenericPatterns[number] extends infer InferredPattern ? InferredPattern : never>;
