import type * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import type { patternValueMaybeAllKind } from "../../kind";
import type { PatternValueMaybeAll } from "..";

export type ComplexMatchedMaybeAll<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = Extract<
	GenericPatternValue,
	PatternValueMaybeAll
> extends infer InferredPatternValue extends PatternValueMaybeAll
	? DCommon.IsEqual<InferredPatternValue, never> extends true
		? never
		: Extract<
			DKind.GetValue<
				typeof patternValueMaybeAllKind,
				InferredPatternValue
			>,
			GenericInput
		>
	: never;
