import { Left } from './left';
import { Right } from './right';
export type SafeCallbackSuccess<GenericValue extends unknown> = Right<"safe-callback-success", GenericValue>;
export type SafeCallbackError = Left<"safe-callback-error", unknown>;
type Either = Right | Left;
type ComputeSafeCallbackResult<GenericOutput extends unknown> = ((GenericOutput extends Either ? GenericOutput : GenericOutput extends Promise<infer InferredValue> ? Promise<ComputeSafeCallbackResult<InferredValue>> : SafeCallbackSuccess<GenericOutput>) | SafeCallbackError);
export declare function safeCallback<const GenericOutput extends unknown>(theFunction: () => GenericOutput): Extract<ComputeSafeCallbackResult<GenericOutput>, any>;
export {};
