import type * as DCommon from "@scripts/common";
import type { IsKeyPattern } from "./isKeyPattern";

export type Shift<
	GenericValue extends string,
> = IsKeyPattern<GenericValue> extends true
	? string
	: DCommon.IsEqual<GenericValue, ""> extends true
		? ""
		: GenericValue extends `${infer _InferredFirst}${infer InferredRest}`
			? InferredRest
			: string;
