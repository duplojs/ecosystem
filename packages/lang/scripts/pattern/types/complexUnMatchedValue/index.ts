import type * as DCommon from "@scripts/common";
import type { PatternValueMaybeAll } from "..";
import type { ComplexUnMatchedArray } from "./array";
import type { ComplexUnMatchedFunction } from "./function";
import type { GetIncompleteUnion } from "./getIncompleteUnion";
import type { ComplexUnMatchedMaybeAll } from "./maybeAll";
import type { ComplexUnMatchedObject } from "./object";
import type { ComplexUnMatchedPrimitive } from "./primitive";
import type { ComplexUnMatchedUnionObject } from "./unionObject";

export type ComplexUnMatchedValue<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = (
	DCommon.IsEqual<GenericInput, unknown> extends true
		? DCommon.AnyValue
		: GenericInput
) extends infer InferredInput
	? (
		InferredInput extends any
			? DCommon.UnionToTuple<keyof GetIncompleteUnion<InferredInput, GenericPatternValue>>["length"] extends 0 | 1
				? never
				: InferredInput
			: never
	) extends infer InferredIncompleteUnionInput
		? [
			Exclude<InferredInput, InferredIncompleteUnionInput>,
			Exclude<GenericPatternValue, PatternValueMaybeAll>,
		] extends [
			infer InferredSortedInput,
			infer InferredPatternValue,
		]
			? (
				| ComplexUnMatchedPrimitive<InferredSortedInput, InferredPatternValue>
				| ComplexUnMatchedObject<InferredSortedInput, InferredPatternValue>
				| ComplexUnMatchedArray<InferredSortedInput, InferredPatternValue>
				| ComplexUnMatchedUnionObject<InferredSortedInput, InferredPatternValue>
				| ComplexUnMatchedFunction<InferredSortedInput, InferredPatternValue>
				// need to use GenericPatternValue
				| ComplexUnMatchedMaybeAll<InferredSortedInput, GenericPatternValue>
				| InferredIncompleteUnionInput
			)
			: never
		: never
	: never;
