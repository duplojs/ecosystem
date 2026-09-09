import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import type * as DTuple from "@scripts/tuple";
import { type ExtractLengthEqual, type LengthEqual } from "./lengthEqual";
import { type ExtractMaxElements, type MaxElements } from "./maxElements";

export type MinElementsConstraintName = "array-min-elements";

export interface MinElements<
	GenericMin extends number,
> extends DCommon.DynamicConstraint<MinElementsConstraintName, GenericMin> {}

export type ExtractMinElements<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			| (
				GenericConstraint extends MinElements<infer InferredMin>
					? InferredMin extends number
						? MinElements<InferredMin>
						: never
					: never
			)
			| (
				GenericConstraint extends DCommon.AnyTuple
					? MinElements<
						DTuple.CountMinElement<
							Extract<
								DCommon.RemoveConstraint<GenericConstraint>,
								DCommon.AnyTuple
							>
						>
					>
					: never
			)
			| (
				GenericConstraint extends LengthEqual<infer InferredLength>
					? InferredLength extends number
						? MinElements<InferredLength>
						: never
					: never
			)
		>,
		unknown,
		GenericDefault
	>
	: never;

export type ComputeMinElementsCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	(
		ExtractMinElements<GenericExpect, unknown> extends MinElements<infer InferredTo>
			? InferredTo extends number
				? ExtractMinElements<GenericValue, unknown> extends MinElements<infer InferredFrom>
					? InferredFrom extends number
						? DNumber.IsLessOrEqual<InferredTo, InferredFrom> extends true
							? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
							: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
						: never
					: never
				: never
			: never
	),
	GenericDefault
>;

export type IsImpossibleToApplyMinElements<
	GenericValue extends unknown,
	GenericExpect extends unknown,
> = DCommon.NeverCoalescing<
	(
		GenericValue extends readonly unknown[]
			? ExtractMinElements<GenericExpect, unknown> extends MinElements<infer InferredTo>
				? InferredTo extends number
					? (
						| (
							ExtractLengthEqual<GenericValue, unknown> extends LengthEqual<infer InferredLength>
								? InferredLength extends number
									? DNumber.IsGreaterOrEqual<InferredLength, InferredTo> extends true
										? false
										: true
									: never
								: never
						)
						| (
							ExtractMaxElements<GenericValue, unknown> extends MaxElements<infer InferredMax>
								? InferredMax extends number
									? DNumber.IsGreaterOrEqual<InferredMax, InferredTo> extends true
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
> extends infer InferredResult
	? DCommon.ContainExtends<InferredResult, true> extends true
		? true
		: false
	: never;
