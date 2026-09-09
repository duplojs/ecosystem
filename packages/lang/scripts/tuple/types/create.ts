import type * as DCommon from "@scripts/common";

export type Create<
	GenericValue extends unknown,
	GenericLength extends number,
	GenericLastTuple extends readonly unknown[] = [],
> = DCommon.IsEqual<GenericLength, number> extends true
	? readonly GenericValue[]
	: DCommon.IsEqual<GenericLength, 0> extends true
		? readonly []
		: [...GenericLastTuple, GenericValue] extends infer InferredResult extends any[]
			? DCommon.IsEqual<InferredResult["length"], GenericLength> extends true
				? readonly [...InferredResult]
				: DCommon.IsEqual<InferredResult["length"], 1000> extends true
					? readonly [...InferredResult, ...GenericValue[]]
					: Create<
						GenericValue,
						GenericLength,
						InferredResult
					>
			: never;
