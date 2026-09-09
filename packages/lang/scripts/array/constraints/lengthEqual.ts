import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import { type ExtractMaxElements, type MaxElements } from "./maxElements";
import { type ExtractMinElements, type MinElements } from "./minElements";

export type LengthEqualConstraintName = "array-length-equal";

export interface LengthEqual<
	GenericLength extends number,
> extends DCommon.DynamicConstraint<LengthEqualConstraintName, GenericLength> {}

export type ExtractLengthEqual<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			| (
				GenericConstraint extends LengthEqual<infer InferredLength>
					? InferredLength extends number
						? LengthEqual<InferredLength>
						: never
					: never
			)
			| (
				GenericConstraint extends DCommon.AnyTuple
					? number extends GenericConstraint["length"]
						? never
						: LengthEqual<GenericConstraint["length"]>
					: never
			)
		>,
		unknown,
		GenericDefault
	>
	: never;

export type ComputeLengthEqualCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	(
		ExtractLengthEqual<GenericExpect, unknown> extends LengthEqual<infer InferredTo>
			? InferredTo extends number
				? ExtractLengthEqual<GenericValue, unknown> extends LengthEqual<infer InferredFrom>
					? InferredFrom extends number
						? DCommon.IsEqual<InferredFrom, InferredTo> extends true
							? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
							: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
						: never
					: never
				: never
			: never
	),
	GenericDefault
>;

export type IsImpossibleToApplyLengthEqual<
	GenericValue extends unknown,
	GenericExpect extends unknown,
> = DCommon.NeverCoalescing<
	(
		GenericValue extends readonly unknown[]
			? ExtractLengthEqual<GenericExpect, unknown> extends LengthEqual<infer InferredTo>
				? InferredTo extends number
					? (
						| (
							ExtractLengthEqual<GenericValue, unknown> extends LengthEqual<infer InferredLength>
								? InferredLength extends number
									? DCommon.IsEqual<InferredLength, InferredTo> extends true
										? false
										: true
									: never
								: never
						)
						| (
							ExtractMinElements<GenericValue, unknown> extends MinElements<infer InferredMin>
								? InferredMin extends number
									? DNumber.IsGreaterOrEqual<InferredTo, InferredMin> extends true
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
