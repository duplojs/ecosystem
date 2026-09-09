import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import { type CastError } from "./error";
import { type CompatibilityConstraintResult, type BaseConstraint } from "../types";

export interface ComputeCastConstraintNumberRule<
	GenericValue extends number,
	GenericExpectedConstraint extends BaseConstraint,
> {
	greaterThan: GenericExpectedConstraint extends DNumber.GreaterThan<number>
		? DCommon.NeverCoalescing<
			| (
				DNumber.ComputeGreaterThanCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: DCommon.IsNever<DNumber.ExtractGreaterThanOrEqual<GenericValue>> extends true
							? CastError<
								`Impossible to cast on GreaterThan<${InferredResult["to"]}> because constraint GreaterThan<${InferredResult["from"]}> from the value is less than.`,
								GenericValue,
								GenericExpectedConstraint
							>
							: CastError<
								`Impossible to cast on GreaterThan<${InferredResult["to"]}> because constraint GreaterThanOrEqual<${InferredResult["from"]}> from the value is less than or equal.`,
								GenericValue,
								GenericExpectedConstraint
							>
					: never
			),
			CastError<
				"Impossible to cast on GreaterThan because value does not have compatible constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
	greaterThanOrEqual: GenericExpectedConstraint extends DNumber.GreaterThanOrEqual<number>
		? DCommon.NeverCoalescing<
			| (
				DNumber.ComputeGreaterThanOrEqualCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: DCommon.IsNever<DNumber.ExtractGreaterThanOrEqual<GenericValue>> extends true
							? CastError<
								`Impossible to cast on GreaterThanOrEqual<${InferredResult["to"]}> because constraint GreaterThan<${InferredResult["from"]}> from the value is less than.`,
								GenericValue,
								GenericExpectedConstraint
							>
							: CastError<
								`Impossible to cast on GreaterThanOrEqual<${InferredResult["to"]}> because constraint GreaterThanOrEqual<${InferredResult["from"]}> from the value is less than.`,
								GenericValue,
								GenericExpectedConstraint
							>
					: never
			),
			CastError<
				"Impossible to cast on GreaterThanOrEqual because value does not have compatible constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
	lessThan: GenericExpectedConstraint extends DNumber.LessThan<number>
		? DCommon.NeverCoalescing<
			| (
				DNumber.ComputeLessThanCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: DCommon.IsNever<DNumber.ExtractLessThanOrEqual<GenericValue>> extends true
							? CastError<
								`Impossible to cast on LessThan<${InferredResult["to"]}> because constraint LessThan<${InferredResult["from"]}> from the value is greater than.`,
								GenericValue,
								GenericExpectedConstraint
							>
							: CastError<
								`Impossible to cast on LessThan<${InferredResult["to"]}> because constraint LessThanOrEqual<${InferredResult["from"]}> from the value is greater than or equal.`,
								GenericValue,
								GenericExpectedConstraint
							>
					: never
			),
			CastError<
				"Impossible to cast on LessThan because value does not have compatible constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
	lessThanOrEqual: GenericExpectedConstraint extends DNumber.LessThanOrEqual<number>
		? DCommon.NeverCoalescing<
			| (
				DNumber.ComputeLessThanOrEqualCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: DCommon.IsNever<DNumber.ExtractLessThanOrEqual<GenericValue>> extends true
							? CastError<
								`Impossible to cast on LessThanOrEqual<${InferredResult["to"]}> because constraint LessThan<${InferredResult["from"]}> from the value is greater than.`,
								GenericValue,
								GenericExpectedConstraint
							>
							: CastError<
								`Impossible to cast on LessThanOrEqual<${InferredResult["to"]}> because constraint LessThanOrEqual<${InferredResult["from"]}> from the value is greater than.`,
								GenericValue,
								GenericExpectedConstraint
							>
					: never
			),
			CastError<
				"Impossible to cast on LessThanOrEqual because value does not have compatible constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
	integer: GenericExpectedConstraint extends DNumber.Integer
		? DCommon.Or<[
			DNumber.IsInteger<GenericValue>,
			DCommon.IsExtends<GenericValue, DNumber.Integer>,
		]> extends true
			? unknown
			: CastError<
				`Impossible to cast on Integer because value ${GenericValue} is not an integer.`,
				GenericValue,
				GenericExpectedConstraint
			>
		: never;
	notZero: GenericExpectedConstraint extends DNumber.NotZero
		? DCommon.Or<[
			DCommon.And<[
				DCommon.Not<DNumber.IsZero<GenericValue>>,
				DNumber.IsLiteral<GenericValue>,
			]>,
			DCommon.IsExtends<GenericValue, DNumber.NotZero>,
		]> extends true
			? unknown
			: CastError<
				`Impossible to cast on NotZero because value ${GenericValue} is equal to zero.`,
				GenericValue,
				GenericExpectedConstraint
			>
		: never;
	safe: GenericExpectedConstraint extends DNumber.Safe
		? DCommon.Or<[
			DNumber.IsSafe<GenericValue>,
			DCommon.IsExtends<GenericValue, DNumber.Safe>,
		]> extends true
			? unknown
			: CastError<
				`Impossible to cast on Safe because value ${GenericValue} is not safe.`,
				GenericValue,
				GenericExpectedConstraint
			>
		: never;
}
