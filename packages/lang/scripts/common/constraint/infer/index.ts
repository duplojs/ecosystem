import type * as DCommon from "@scripts/common";
import type * as DNumber from "@scripts/number";
import type * as DObject from "@scripts/object";
import type * as DString from "@scripts/string";
import type * as DTuple from "@scripts/tuple";
import { type ComputeInferConstraintArrayRule } from "./array";
import { type ComputeInferConstraintNumberRule } from "./number";
import { type ComputeInferConstraintStringRule } from "./string";

export type * from "./array";
export type * from "./number";
export type * from "./string";

export interface ComputeInferConstraintRule<
	GenericInput extends unknown,
	GenericOutput extends unknown,
> {
	string: GenericInput extends string
		? DObject.Values<
			ComputeInferConstraintStringRule<GenericInput, GenericOutput>
		>
		: never;
	number: GenericInput extends number
		? DObject.Values<
			ComputeInferConstraintNumberRule<GenericInput, GenericOutput>
		>
		: never;
	array: GenericInput extends readonly unknown[]
		? DObject.Values<
			ComputeInferConstraintArrayRule<GenericInput, GenericOutput>
		>
		: never;
}

export type ComputeInferConstraint<
	GenericInput extends unknown,
	GenericOutput extends unknown,
> = DCommon.Or<[
	DCommon.IsNever<GenericInput>,
	DCommon.IsNever<GenericOutput>,
]> extends true
	? unknown
	: (
		GenericInput extends unknown
			? (
				GenericOutput extends unknown
					? DObject.Values<
						ComputeInferConstraintRule<
							GenericInput,
							GenericOutput
						>
					> extends infer InferredResult
						? DCommon.ContainExtends<InferredResult, DCommon.ComputedTypeError<string>> extends true
							? Extract<InferredResult, DCommon.ComputedTypeError<string>>
							: GenericInput & DCommon.UnionToIntersection<InferredResult>
						: never
					: never
			) extends infer InferredResult
				? DCommon.IsExtends<InferredResult, DCommon.ComputedTypeError<string>> extends true
					? InferredResult
					: Extract<InferredResult, DCommon.BaseConstraint>
				: never
			: never
	) extends infer InferredResult
		? DCommon.IsExtends<InferredResult, DCommon.BaseConstraint> extends true
			? Extract<InferredResult, DCommon.BaseConstraint>
			: InferredResult
		: never;

export type SupportedOutputInfer = (
	| string
	| readonly unknown[]
	| number
);

type ComputeInferInputRequirement<
	GenericInput extends unknown,
> = GenericInput extends string
	? DString.RequireLiteral<GenericInput>
	: GenericInput extends number
		? DNumber.RequireLiteral<GenericInput>
		: GenericInput extends readonly unknown[]
			? DTuple.Require<GenericInput>
			: never;

export function infer<
	GenericOutput extends unknown,
	const GenericInput extends DCommon.RemoveConstraint<
		Extract<GenericOutput, SupportedOutputInfer>
	> = never,
	GenericComputedOutput = ComputeInferConstraint<
		GenericInput,
		Extract<GenericOutput, SupportedOutputInfer>
	>,
>(
	input: (
		& GenericInput
		& ComputeInferInputRequirement<GenericInput>
		& DCommon.BreakGenericLink<
			DCommon.NeverCoalescing<
				GenericComputedOutput extends DCommon.ComputedTypeError<string>
					? GenericComputedOutput
					: never,
				unknown
			>
		>
	),
): DCommon.Or<[
	DCommon.IsNever<GenericInput>,
	DCommon.ContainExtends<GenericComputedOutput, DCommon.ComputedTypeError<string>>,
]> extends true
	? GenericOutput
	: DCommon.BreakGenericLink<
		DCommon.NeverCoalescing<
			GenericComputedOutput,
			GenericInput
		>
	> {
	return input as never;
}
