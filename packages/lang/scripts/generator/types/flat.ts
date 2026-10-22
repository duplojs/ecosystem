import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";

export type FlatIterator<
	GenericValue extends unknown,
	GenericDepth extends number,
	GenericAcc extends never[] = [],
> = GenericDepth extends unknown
	? DCommon.And<[
		DNumber.IsInteger<GenericDepth>,
		DCommon.Not<DNumber.IsNegative<GenericDepth>>,
	]> extends true
		? DCommon.IsEqual<GenericAcc["length"], GenericDepth> extends true
			? GenericValue
			: DCommon.IsEqual<GenericAcc["length"], 250> extends true
				? GenericValue
				: GenericValue extends object
					? GenericValue extends Iterable<infer InferredValue>
						? FlatIterator<InferredValue, GenericDepth, [...GenericAcc, never]>
						: GenericValue
					: GenericValue
		: unknown
	: never;

export type FlatAsyncIterator<
	GenericValue extends unknown,
	GenericDepth extends number,
	GenericAcc extends never[] = [],
> = GenericDepth extends unknown
	? DCommon.And<[
		DNumber.IsInteger<GenericDepth>,
		DCommon.Not<DNumber.IsNegative<GenericDepth>>,
	]> extends true
		? Awaited<GenericValue> extends infer InferredAwaitedValue
			? DCommon.IsEqual<GenericAcc["length"], GenericDepth> extends true
				? InferredAwaitedValue
				: DCommon.IsEqual<GenericAcc["length"], 250> extends true
					? InferredAwaitedValue
					: InferredAwaitedValue extends object
						? InferredAwaitedValue extends AsyncIterable<infer InferredValue>
							? FlatAsyncIterator<InferredValue, GenericDepth, [...GenericAcc, never]>
							: InferredAwaitedValue extends Iterable<infer InferredValue>
								? FlatAsyncIterator<InferredValue, GenericDepth, [...GenericAcc, never]>
								: InferredAwaitedValue
						: InferredAwaitedValue
			: never
		: unknown
	: never;
