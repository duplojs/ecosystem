import type * as DCommon from "@scripts/common";
import type { PatternValueMaybeAll } from "..";
import type { ComplexMatchedArray } from "./array";
import type { ComplexMatchedFunction } from "./function";
import type { ComplexMatchedMaybeAll } from "./maybeAll";
import type { ComplexMatchedObject } from "./object";
import type { ComplexMatchedPrimitive } from "./primitive";

export type ComplexMatchedValue<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = (
	DCommon.IsEqual<GenericInput, unknown> extends true
		? DCommon.AnyValue
		: GenericInput
) extends infer InferredInput
	? Exclude<
		GenericPatternValue,
		PatternValueMaybeAll
	> extends infer InferredPatternValue
		? (
		| ComplexMatchedPrimitive<InferredInput, InferredPatternValue>
		| ComplexMatchedObject<InferredInput, InferredPatternValue>
		| ComplexMatchedArray<InferredInput, InferredPatternValue>
		| ComplexMatchedFunction<InferredInput, InferredPatternValue>
		// need to use GenericPatternValue
		| ComplexMatchedMaybeAll<InferredInput, GenericPatternValue>
		)
		: never
	: never;
