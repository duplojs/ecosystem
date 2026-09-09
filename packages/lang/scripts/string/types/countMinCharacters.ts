import type * as DTuple from "@scripts/tuple";
import type * as DCommon from "@scripts/common";
import { type Split } from "./split";

export type CountMinCharacters<
	GenericString extends string,
> = string extends GenericString
	? number
	: GenericString extends ""
		? 0
		: Split<GenericString, ""> extends infer InferredResult
			? InferredResult extends DCommon.AnyTuple
				? DTuple.CountMinElement<InferredResult>
				: number
			: never;
