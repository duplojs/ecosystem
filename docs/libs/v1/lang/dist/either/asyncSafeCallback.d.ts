import { Left } from './left';
import { Right } from './right';
import { SafeCallbackError, SafeCallbackSuccess } from './safeCallback';
type Either = Right | Left;
type ComputeSafeCallbackResult<GenericOutput extends unknown> = Extract<(GenericOutput extends Either ? GenericOutput : GenericOutput extends Promise<infer InferredValue> ? ComputeSafeCallbackResult<InferredValue> : SafeCallbackSuccess<GenericOutput>), any>;
export declare function asyncSafeCallback<const GenericOutput extends unknown>(maybeFunction: (() => GenericOutput) | Promise<GenericOutput>): Promise<ComputeSafeCallbackResult<GenericOutput> | SafeCallbackError>;
export {};
