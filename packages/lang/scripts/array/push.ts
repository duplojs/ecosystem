import type * as DCommon from "@scripts/common";
import type { ExtractMaxElements, ExtractMinElements, MaxElements, MinElements } from "./constraints";
import type * as DNumber from "@scripts/number";

type PushOutput<
	GenericArray extends readonly unknown[],
	GenericValue extends unknown,
	GenericValuesRest extends readonly unknown[] = [],
> = GenericArray extends unknown
	? (
		& readonly (
				| GenericArray[number]
				| GenericValue
				| GenericValuesRest[number]
		)[]
		& (
			ExtractMinElements<GenericArray, unknown> extends MinElements<infer InferredValue>
				? DCommon.UnionToIntersection<
					InferredValue extends number
						? MinElements<DNumber.AddOne<InferredValue>>
						: never
				>
				: unknown
		)
		& (
			DCommon.IsEqual<GenericValuesRest, []> extends true
				? ExtractMaxElements<GenericArray, unknown> extends MaxElements<infer InferredValue>
					? DCommon.UnionToIntersection<
						InferredValue extends number
							? MaxElements<DNumber.AddOne<InferredValue>>
							: never
					>
					: unknown
				: unknown
		)
	)
	: never;

export function push<
	GenericArray extends readonly unknown[],
	const GenericValue extends unknown,
>(
	value: GenericValue,
): (
	array: GenericArray,
) => PushOutput<GenericArray, GenericValue>;

export function push<
	GenericArray extends readonly unknown[],
	const GenericValue extends unknown,
	GenericValuesRest extends readonly unknown[],
>(
	array: GenericArray,
	value: GenericValue,
	...valuesRest: GenericValuesRest
): PushOutput<GenericArray, GenericValue, GenericValuesRest>;

export function push(
	...args:
		| [value: unknown]
		| [array: readonly unknown[], value: unknown, ...valuesRest: readonly unknown[]]
): any {
	if (args.length === 1) {
		const [value] = args;

		return (array: readonly unknown[]) => push(array, value);
	}

	const [array, ...values] = args as [unknown[], ...unknown[]];

	const result = array.slice();
	// Use a loop if spread inputs can become large.
	result.push(...values);

	return result;
}
