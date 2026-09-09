import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import { type CountMinCharacters, type IsLiteral } from "../types";
import { type IsTemplateLiteral } from "../types/isTemplateLiteral";
import { type ExtractLengthEqual, type LengthEqual } from "./lengthEqual";
import { type ExtractMaxCharacters, type MaxCharacters } from "./maxCharacters";

export type MinCharactersConstraintName = "string-min-characters";

export interface MinCharacters<
	GenericMin extends number,
> extends DCommon.DynamicConstraint<MinCharactersConstraintName, GenericMin> {}

export type ExtractMinCharacters<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			| (
				GenericConstraint extends MinCharacters<infer InferredMin>
					? InferredMin extends number
						? MinCharacters<InferredMin>
						: never
					: never
			)
			| (
				GenericConstraint extends string
					? DCommon.Or<[
						IsLiteral<GenericConstraint>,
						IsTemplateLiteral<GenericConstraint>,
					]> extends true
						? MinCharacters<
							CountMinCharacters<
								Extract<
									DCommon.RemoveConstraint<GenericConstraint>,
									string
								>
							>
						>
						: never
					: never
			)
			| (
				GenericConstraint extends LengthEqual<infer InferredLength>
					? InferredLength extends number
						? MinCharacters<InferredLength>
						: never
					: never
			)
		>,
		unknown,
		GenericDefault
	>
	: never;

export type ComputeMinCharactersCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	(
		ExtractMinCharacters<GenericExpect, unknown> extends MinCharacters<infer InferredTo>
			? InferredTo extends number
				? ExtractMinCharacters<GenericValue, unknown> extends MinCharacters<infer InferredFrom>
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

export type IsImpossibleToApplyMinCharacters<
	GenericValue extends unknown,
	GenericExpect extends unknown,
> = DCommon.NeverCoalescing<
	(
		GenericValue extends string
			? ExtractMinCharacters<GenericExpect, unknown> extends MinCharacters<infer InferredTo>
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
