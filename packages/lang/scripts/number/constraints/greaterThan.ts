import type * as DCommon from "@scripts/common";
import { type IsGreater, type IsLess, type IsLessOrEqual } from "../types";
import { type ExtractGreaterThanOrEqual, type GreaterThanOrEqual } from "./greaterThanOrEqual";
import { type ExtractLessThanOrEqual, type LessThanOrEqual } from "./lessThanOrEqual";
import { type LessThan, type ExtractLessThan } from "./lessThan";

export type GreaterThanConstraintName = "number-greater-than";

export interface GreaterThan<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<GreaterThanConstraintName, GenericNumber> {}

export type ExtractGreaterThan<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			GenericConstraint extends GreaterThan<infer InferredMin>
				? InferredMin extends number
					? GreaterThan<InferredMin>
					: never
				: never
		>,
		unknown,
		GenericDefault
	>
	: never;

export type ComputeGreaterThanCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	(
		ExtractGreaterThan<GenericExpect, unknown> extends GreaterThan<infer InferredTo>
			? InferredTo extends number
				? (
					| (
						ExtractGreaterThan<GenericValue, unknown> extends GreaterThan<infer InferredFrom>
							? InferredFrom extends number
								? IsLessOrEqual<InferredTo, InferredFrom> extends true
									? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
									: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
								: never
							: never
					)
					| (
						ExtractGreaterThanOrEqual<GenericValue, unknown> extends GreaterThanOrEqual<infer InferredFrom>
							? InferredFrom extends number
								? IsLess<InferredTo, InferredFrom> extends true
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

export type IsImpossibleToApplyGreaterThan<
	GenericValue extends unknown,
	GenericExpect extends unknown,
> = DCommon.NeverCoalescing<
	(
		GenericValue extends number
			? ExtractGreaterThan<GenericExpect, unknown> extends GreaterThan<infer InferredTo>
				? InferredTo extends number
					? (
						| (
							ExtractLessThanOrEqual<GenericValue, unknown> extends LessThanOrEqual<infer InferredMax>
								? InferredMax extends number
									? IsGreater<InferredMax, InferredTo> extends true
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
