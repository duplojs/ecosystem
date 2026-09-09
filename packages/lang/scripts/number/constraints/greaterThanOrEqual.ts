import type * as DCommon from "@scripts/common";
import { type IsGreater, type IsGreaterOrEqual, type IsLessOrEqual, type IsLiteral } from "../types";
import { type ExtractGreaterThan, type GreaterThan } from "./greaterThan";
import { type ExtractLessThan, type LessThan } from "./lessThan";
import { type ExtractLessThanOrEqual, type LessThanOrEqual } from "./lessThanOrEqual";

export type GreaterThanOrEqualConstraintName = "number-greater-than-or-equal";

export interface GreaterThanOrEqual<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<GreaterThanOrEqualConstraintName, GenericNumber> {}

export type ExtractGreaterThanOrEqual<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			| (
				GenericConstraint extends GreaterThanOrEqual<infer InferredMin>
					? InferredMin extends number
						? GreaterThanOrEqual<InferredMin>
						: never
					: never
			)
			| (
				GenericConstraint extends number
					? IsLiteral<GenericConstraint> extends true
						? GreaterThanOrEqual<
							Extract<
								DCommon.RemoveConstraint<GenericConstraint>,
								number
							>
						>
						: never
					: never
			)
		>,
		unknown,
		GenericDefault
	>
	: never;

export type ComputeGreaterThanOrEqualCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	(
		ExtractGreaterThanOrEqual<GenericExpect, unknown> extends GreaterThanOrEqual<infer InferredTo>
			? InferredTo extends number
				? (
					| (
						ExtractGreaterThanOrEqual<GenericValue, unknown> extends GreaterThanOrEqual<infer InferredFrom>
							? InferredFrom extends number
								? IsLessOrEqual<InferredTo, InferredFrom> extends true
									? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
									: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
								: never
							: never
					)
					| (
						ExtractGreaterThan<GenericValue, unknown> extends GreaterThan<infer InferredFrom>
							? InferredFrom extends number
								? IsLessOrEqual<InferredTo, InferredFrom> extends true
									? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
									: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
								: never
							: never
					)
				)
				: never
			: never
	),
	GenericDefault
>;

export type IsImpossibleToApplyGreaterThanOrEqual<
	GenericValue extends unknown,
	GenericExpect extends unknown,
> = DCommon.NeverCoalescing<
	(
		GenericValue extends number
			? ExtractGreaterThanOrEqual<GenericExpect, unknown> extends GreaterThanOrEqual<infer InferredTo>
				? InferredTo extends number
					? (
						| (
							ExtractLessThanOrEqual<GenericValue, unknown> extends LessThanOrEqual<infer InferredMax>
								? InferredMax extends number
									? IsGreaterOrEqual<InferredMax, InferredTo> extends true
										? false
										: true
									: never
								: never
						)
						| (
							ExtractLessThan<GenericValue, unknown> extends LessThan<infer InferredMax>
								? InferredMax extends number
									? IsGreater<InferredMax, InferredTo> extends true
										? false
										: true
									: never
								: never
						)
					)
					: never
				: true
			: false
	),
	false
> extends true
	? true
	: false;
