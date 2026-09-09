import type * as DArray from "@scripts/array";
import type * as DCommon from "@scripts/common";

export interface ComputeInferConstraintArrayRule<
	GenericInput extends readonly unknown[],
	GenericOutput extends unknown,
> {
	maxElements: DArray.ComputeMaxElementsCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DArray.MaxElements<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on MaxElements<${InferredResult["to"]}> because constraint MaxElements<${InferredResult["from"]}> from the value is more than.`>
		: never;
	minElements: DArray.ComputeMinElementsCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DArray.MinElements<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on MinElements<${InferredResult["to"]}> because constraint MinElements<${InferredResult["from"]}> from the value is less than.`>
		: never;
	lengthEqual: DArray.ComputeLengthEqualCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DArray.LengthEqual<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on LengthEqual<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is not equal.`>
		: never;
}
