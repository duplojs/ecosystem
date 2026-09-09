import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import { type IsLiteral, type Length } from "../types";
import { type ExtractMaxCharacters, type MaxCharacters } from "./maxCharacters";
import { type ExtractMinCharacters, type MinCharacters } from "./minCharacters";

export type LengthEqualConstraintName = "string-length-equal";

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
				GenericConstraint extends string
					? IsLiteral<GenericConstraint> extends true
						? LengthEqual<
							Length<
								Extract<
									DCommon.RemoveConstraint<GenericConstraint>,
									string
								>
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
		GenericValue extends string
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
							ExtractMinCharacters<GenericValue, unknown> extends MinCharacters<infer InferredMin>
								? InferredMin extends number
									? DNumber.IsGreaterOrEqual<InferredTo, InferredMin> extends true
										? false
										: true
									: never
								: never
						)
						| (
							ExtractMaxCharacters<GenericValue, unknown> extends MaxCharacters<infer InferredMax>
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
