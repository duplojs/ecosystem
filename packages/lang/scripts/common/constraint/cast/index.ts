import type * as DArray from "@scripts/array";
import type * as DTuple from "@scripts/tuple";
import type * as DObject from "@scripts/object";
import { type ComputeCastConstraintArrayRule } from "./array";
import { type UnbundlesConstraint, type BaseConstraint, type RemoveConstraint } from "../types";
import { type CastError, type RemoveCastError } from "./error";
import { type ComputeCastConstraintNumberRule } from "./number";
import { type ComputeCastConstraintStringRule } from "./string";
import { type AnyTuple, type IsExtends, type BreakGenericLink, type NeverCoalescing, type UnionContain, type IsEqual } from "../../types";

export type * from "./array";
export type * from "./error";
export type * from "./number";
export type * from "./string";

export interface ComputeCastConstraintRule<
	GenericValue extends unknown,
	GenericConstraint extends BaseConstraint,
> {
	string: GenericValue extends string
		? DObject.Values<
			ComputeCastConstraintStringRule<GenericValue, GenericConstraint>
		>
		: never;
	number: GenericValue extends number
		? DObject.Values<
			ComputeCastConstraintNumberRule<GenericValue, GenericConstraint>
		>
		: never;
	array: GenericValue extends readonly unknown[]
		? DObject.Values<
			ComputeCastConstraintArrayRule<GenericValue, GenericConstraint>
		>
		: never;
}

export type ComputeCastConstraint<
	GenericValue extends unknown,
	GenericExpectedValue extends unknown,
> = (
	GenericExpectedValue extends any
		? [UnbundlesConstraint<GenericExpectedValue>]
		: never
) extends infer InferredComputedExpectedValue extends [BaseConstraint]
	? DArray.Unwrap<
		NeverCoalescing<
			Extract<
				GenericValue extends any
					? (
						InferredComputedExpectedValue extends [infer InferredConstraint extends BaseConstraint]
							? NeverCoalescing<
								Extract<
									InferredConstraint extends any
										? [
											GenericValue extends InferredConstraint
												? unknown
												: NeverCoalescing<
													DObject.Values<
														ComputeCastConstraintRule<GenericValue, InferredConstraint>
													>,
													CastError<
														"None of the intended constraints is possible on the current value.",
														GenericValue,
														InferredConstraint
													>
												>,
										]
										: never,
									[CastError<any, any, any>]
								>,
								[unknown]
							>
							: never
					) extends infer InferredResult
						? UnionContain<InferredResult, [unknown]> extends true
							? [unknown]
							: InferredResult
						: never
					: never,
				[CastError<any, any, any>]
			>,
			unknown
		>
	>
	: never;

type ComputeTransformCastValue<
	GenericValue extends unknown,
> = GenericValue extends readonly unknown[]
	? DArray.ExtractLengthEqual<GenericValue, unknown> extends DArray.LengthEqual<infer InferredLength>
		? DTuple.Create<GenericValue[number], InferredLength>
		: DArray.ExtractMinElements<GenericValue, unknown> extends DArray.MinElements<infer InferredMin>
			? readonly [...DTuple.Create<GenericValue[number], InferredMin>, ...GenericValue]
			: RemoveConstraint<GenericValue>
	: RemoveConstraint<GenericValue>;

export type ComputeCastValue<
	GenericValue extends unknown,
	GenericExpectedValue extends unknown,
> = [
	ComputeTransformCastValue<GenericValue>,
	ComputeTransformCastValue<GenericExpectedValue>,
] extends [
	infer InferredValue,
	infer InferredExpectedValue,
]
	? IsExtends<InferredValue, InferredExpectedValue> extends true
		? unknown
		: CastError<
			"Input value are not Extends",
			InferredValue,
			InferredExpectedValue
		>
	: never;

export function cast<
	GenericInput extends unknown,
	GenericExpectedValue extends unknown,
	GenericError = (
		RemoveCastError<GenericInput> extends infer InferredInput
			? ComputeCastConstraint<
				InferredInput,
				GenericExpectedValue
			> extends infer InferredConstraintResult
				? IsEqual<InferredConstraintResult, unknown> extends true
					? ComputeCastValue<
						InferredInput,
						GenericExpectedValue
					>
					: InferredConstraintResult
				: never
			: never
	),
>(
	input: (
		& GenericInput
		& BreakGenericLink<GenericError>
	),
): GenericExpectedValue;

export function cast(
	input: any,
): any {
	return input;
}

export function shameOnYou<
	GenericOutput extends unknown,
>(
	value: NoInfer<RemoveConstraint<GenericOutput>>,
): GenericOutput {
	return value as never;
}
