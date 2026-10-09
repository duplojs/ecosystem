import type * as DCommon from '../common';
type EndWithOutput<GenericString extends string, GenericSearchString extends string> = Extract<GenericString, `${string}${GenericSearchString}`> extends infer InferredResult extends GenericString ? DCommon.IsEqual<InferredResult, never> extends true ? GenericString & `${string}${GenericSearchString}` : InferredResult : never;
export declare function endsWith<GenericString extends string, GenericSearchString extends string>(searchString: GenericSearchString): (string: GenericString) => string is EndWithOutput<GenericString, GenericSearchString>;
export declare function endsWith<GenericString extends string, GenericSearchString extends string>(string: GenericString, searchString: GenericSearchString): string is EndWithOutput<GenericString, GenericSearchString>;
export {};
