import type * as DCommon from "@scripts/common";

export type FlatIterator<
	GenericValue extends unknown,
	GenericDepth extends number,
	GenericAcc extends never[] = [],
> = DCommon.IsEqual<GenericAcc["length"], GenericDepth> extends true
	? GenericValue
	: DCommon.IsEqual<GenericAcc["length"], 250> extends true
		? GenericValue
		: GenericValue extends string
			? GenericValue
			: GenericValue extends Iterable<infer InferredValue>
				? FlatIterator<InferredValue, GenericDepth, [...GenericAcc, never]>
				: GenericValue;

export type FlatAsyncIterator<
	GenericValue extends unknown,
	GenericDepth extends number,
	GenericAcc extends never[] = [],
> = DCommon.IsEqual<GenericAcc["length"], GenericDepth> extends true
	? GenericValue
	: DCommon.IsEqual<GenericAcc["length"], 250> extends true
		? GenericValue
		: GenericValue extends string
			? GenericValue
			: GenericValue extends Iterable<infer InferredValue>
				? FlatIterator<InferredValue, GenericDepth, [...GenericAcc, never]>
				: GenericValue extends AsyncIterable<infer InferredValue>
					? FlatIterator<InferredValue, GenericDepth, [...GenericAcc, never]>
					: GenericValue;
