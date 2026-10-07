import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import { type ExtractMinElements, type MinElements, type ExtractMaxElements, type MaxElements } from "./constraints";

type LengthOutput<
	GenericArray extends readonly unknown[],
> = Extract<
	GenericArray extends unknown
		? (
			& number
			& DNumber.Positive
			& (
				ExtractMaxElements<GenericArray, unknown> extends MaxElements<infer InferredValue>
					? DCommon.UnionToIntersection<
						InferredValue extends number
							? DNumber.LessThanOrEqual<InferredValue>
							: never
					>
					: unknown
			)
			& (
				ExtractMinElements<GenericArray, unknown> extends MinElements<infer InferredValue>
					? DCommon.UnionToIntersection<
						InferredValue extends number
							? DNumber.GreaterThanOrEqual<InferredValue>
							: never
					>
					: unknown
			)
		)
		: never,
	any
>;

export function length<
	const GenericArray extends readonly unknown[],
>(
	array: GenericArray,
): LengthOutput<GenericArray>;

export function length(
	array: readonly unknown[],
) {
	return array.length;
}
