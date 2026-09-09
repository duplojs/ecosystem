import type * as DArray from "@scripts/array";
import type * as DCommon from "@scripts/common";
import { type CastError } from "./error";
import { type CompatibilityConstraintResult, type BaseConstraint } from "../types";

export interface ComputeCastConstraintArrayRule<
	GenericValue extends readonly unknown[],
	GenericExpectedConstraint extends BaseConstraint,
> {
	minElements: GenericExpectedConstraint extends DArray.MinElements<number>
		? DCommon.NeverCoalescing<
			| (
				DArray.ComputeMinElementsCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: DCommon.IsNever<DArray.ExtractLengthEqual<GenericValue>> extends true
							? CastError<
								`Impossible to cast on MinElements<${InferredResult["to"]}> because constraint MinElements<${InferredResult["from"]}> from the value is less than.`,
								GenericValue,
								GenericExpectedConstraint
							>
							: CastError<
								`Impossible to cast on MinElements<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is less than.`,
								GenericValue,
								GenericExpectedConstraint
							>
					: never
			),
			CastError<
				"Impossible to cast on MinElements because value does not have MinElements constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
	maxElements: GenericExpectedConstraint extends DArray.MaxElements<number>
		? DCommon.NeverCoalescing<
			| (
				DArray.ComputeMaxElementsCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: DCommon.IsNever<DArray.ExtractLengthEqual<GenericValue>> extends true
							? CastError<
								`Impossible to cast on MaxElements<${InferredResult["to"]}> because constraint MaxElements<${InferredResult["from"]}> from the value is more than.`,
								GenericValue,
								GenericExpectedConstraint
							>
							: CastError<
								`Impossible to cast on MaxElements<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is more than.`,
								GenericValue,
								GenericExpectedConstraint
							>
					: never
			),
			CastError<
				"Impossible to cast on MaxElements because value does not have MaxElements constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
	lengthEqual: GenericExpectedConstraint extends DArray.LengthEqual<number>
		? DCommon.NeverCoalescing<
			| (
				DArray.ComputeLengthEqualCompatibility<
					GenericValue,
					GenericExpectedConstraint,
					unknown
				> extends infer InferredResult extends CompatibilityConstraintResult<boolean, number, number>
					? InferredResult extends CompatibilityConstraintResult<true>
						? unknown
						: CastError<
							`Impossible to cast on LengthEqual<${InferredResult["to"]}> because constraint LengthEqual<${InferredResult["from"]}> from the value is not equal.`,
							GenericValue,
							GenericExpectedConstraint
						>
					: never
			),
			CastError<
				"Impossible to cast on LengthEqual because value does not have LengthEqual constraint.",
				GenericValue,
				GenericExpectedConstraint
			>
		>
		: never;
}
