import type * as DCommon from "@scripts/common";
import type { IsKeyPattern } from "./isKeyPattern";

type _Pop<
	GenericValue extends string,
	GenericCount extends never[] = [],
> = DCommon.IsEqual<GenericCount["length"], 250> extends true
	? string
	: GenericValue extends `${infer InferredFirst}${infer InferredRest}`
		? DCommon.IsEqual<InferredRest, ""> extends true
			? ""
			: _Pop<InferredRest, [...GenericCount, never]> extends infer InferredResult extends string
				? `${InferredFirst}${InferredResult}`
				: never
		: string;

export type Pop<
	GenericValue extends string,
> = IsKeyPattern<GenericValue> extends true
	? string
	: DCommon.IsEqual<GenericValue, ""> extends true
		? ""
		: _Pop<GenericValue>;
