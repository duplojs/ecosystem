import type * as DCommon from "@scripts/common";
import { type IsGreater, type IsGreaterOrEqual, type IsLiteral } from "../types";
import { type ExtractGreaterThan, type GreaterThan } from "./greaterThan";
import { type ExtractGreaterThanOrEqual, type GreaterThanOrEqual } from "./greaterThanOrEqual";
import { type ExtractLessThan, type LessThan } from "./lessThan";

export type LessThanOrEqualConstraintName = "number-greater-less-or-equal";

export interface LessThanOrEqual<
	GenericNumber extends number,
> extends DCommon.DynamicConstraint<LessThanOrEqualConstraintName, GenericNumber> {}

export type ExtractLessThanOrEqual<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			| (
				GenericConstraint extends LessThanOrEqual<infer InferredMax>
					? InferredMax extends number
						? LessThanOrEqual<InferredMax>
						: never
					: never
			)
			| (
				GenericConstraint extends number
					? IsLiteral<GenericConstraint> extends true
						? LessThanOrEqual<
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

export type ComputeLessThanOrEqualCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	(
		ExtractLessThanOrEqual<GenericExpect, unknown> extends LessThanOrEqual<infer InferredTo>
			? InferredTo extends number
				? (
					| (
						ExtractLessThanOrEqual<GenericValue, unknown> extends LessThanOrEqual<infer InferredFrom>
							? InferredFrom extends number
								? IsGreaterOrEqual<InferredTo, InferredFrom> extends true
									? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
									: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
								: never
							: never
					)
					| (
						ExtractLessThan<GenericValue, unknown> extends LessThan<infer InferredFrom>
							? InferredFrom extends number
								? IsGreaterOrEqual<InferredTo, InferredFrom> extends true
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

export type IsImpossibleToApplyLessThanOrEqual<
	GenericValue extends unknown,
	GenericExpect extends unknown,
> = DCommon.NeverCoalescing<
	(
		GenericValue extends number
			? ExtractLessThanOrEqual<GenericExpect, unknown> extends LessThanOrEqual<infer InferredTo>
				? InferredTo extends number
					? (
						| (
							ExtractGreaterThan<GenericValue, unknown> extends GreaterThan<infer InferredMin>
								? InferredMin extends number
									? IsGreater<InferredTo, InferredMin> extends true
										? false
										: true
									: never
								: never
						)
						| (
							(
								ExtractGreaterThanOrEqual<GenericValue, unknown>
							) extends GreaterThanOrEqual<infer InferredMin>
								? InferredMin extends number
									? IsGreaterOrEqual<InferredTo, InferredMin> extends true
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
