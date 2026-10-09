import type * as DCommon from '../common';
type StartWithOutput<GenericString extends string, GenericSearchString extends string> = Extract<GenericString, `${GenericSearchString}${string}`> extends infer InferredResult extends GenericString ? DCommon.IsEqual<InferredResult, never> extends true ? GenericString & `${GenericSearchString}${string}` : InferredResult : never;
export declare function startsWith<GenericString extends string, GenericSearchString extends string>(searchString: GenericSearchString): (string: GenericString) => string is StartWithOutput<GenericString, GenericSearchString>;
export declare function startsWith<GenericString extends string, GenericSearchString extends string>(string: GenericString, searchString: GenericSearchString): string is StartWithOutput<GenericString, GenericSearchString>;
export {};
