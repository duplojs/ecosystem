import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";

export interface ComputeInferConstraintNumberRule<
	GenericInput extends number,
	GenericOutput extends unknown,
> {
	greaterThan: DNumber.ComputeGreaterThanCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DNumber.GreaterThan<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on GreaterThan<${InferredResult["to"]}> because value ${InferredResult["from"]} is less than or equal.`>
		: never;
	greaterThanOrEqual: DNumber.ComputeGreaterThanOrEqualCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DNumber.GreaterThanOrEqual<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on GreaterThanOrEqual<${InferredResult["to"]}> because value ${InferredResult["from"]} is less than.`>
		: never;
	lessThan: DNumber.ComputeLessThanCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DNumber.LessThan<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on LessThan<${InferredResult["to"]}> because value ${InferredResult["from"]} is greater than or equal.`>
		: never;
	lessThanOrEqual: DNumber.ComputeLessThanOrEqualCompatibility<
		GenericInput,
		GenericOutput,
		unknown
	> extends infer InferredResult extends DCommon.CompatibilityConstraintResult<boolean, number, number>
		? InferredResult extends DCommon.CompatibilityConstraintResult<true>
			? DNumber.LessThanOrEqual<InferredResult["to"]>
			: DCommon.ComputedTypeError<`Impossible to cast on LessThanOrEqual<${InferredResult["to"]}> because value ${InferredResult["from"]} is greater than.`>
		: never;
	integer: DCommon.IsExtends<GenericOutput, DNumber.Integer> extends true
		? DNumber.IsInteger<GenericInput> extends true
			? DNumber.Integer
			: DCommon.ComputedTypeError<`Impossible to cast on Integer because value ${GenericInput} is not an integer.`>
		: never;
	notZero: DCommon.IsExtends<GenericOutput, DNumber.NotZero> extends true
		? DNumber.IsZero<GenericInput> extends true
			? DCommon.ComputedTypeError<`Impossible to cast on NotZero because value ${GenericInput} is equal to zero.`>
			: DNumber.NotZero
		: never;
	safe: DCommon.IsExtends<GenericOutput, DNumber.Safe> extends true
		? DNumber.IsSafe<GenericInput> extends true
			? DNumber.Safe
			: DCommon.ComputedTypeError<`Impossible to cast on Safe because value ${GenericInput} is not safe.`>
		: never;
}
