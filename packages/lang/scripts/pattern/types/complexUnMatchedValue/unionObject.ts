import type * as DCommon from "@scripts/common";
import type { ComplexUnMatchedValue } from ".";

export type ComplexUnMatchedUnionObject<
	GenericInput extends unknown,
	GenericPatternValue extends unknown,
> = (
	DCommon.IsUnion<Extract<GenericPatternValue, object>> extends false
		? never
		: Extract<GenericPatternValue, any> extends infer InferredPatternValue
			? (
				InferredPatternValue extends object
					? ComplexUnMatchedValue<GenericInput, InferredPatternValue> extends infer InferredResult
						? ComplexUnMatchedValue<
							InferredResult,
							Exclude<GenericPatternValue, InferredPatternValue>
						>
						: never
					: never
			) extends infer InferredResult
				? DCommon.RemoveDuplicateInUnion<InferredResult>
				: never
			: never
);
