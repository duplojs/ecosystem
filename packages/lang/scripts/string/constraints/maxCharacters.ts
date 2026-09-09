import type * as DNumber from "@scripts/number";
import type * as DCommon from "@scripts/common";
import { type IsLiteral, type Length } from "../types";
import { type ExtractLengthEqual, type LengthEqual } from "./lengthEqual";
import { type ExtractMinCharacters, type MinCharacters } from "./minCharacters";

export type MaxCharactersConstraintName = "string-max-characters";

export interface MaxCharacters<
	GenericMax extends number,
> extends DCommon.DynamicConstraint<MaxCharactersConstraintName, GenericMax> {}

export type ExtractMaxCharacters<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			| (
				GenericConstraint extends MaxCharacters<infer InferredMax>
					? InferredMax extends number
						? MaxCharacters<InferredMax>
						: never
					: never
			)
			| (
				GenericConstraint extends string
					? IsLiteral<GenericConstraint> extends true
						? MaxCharacters<
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
			| (
				GenericConstraint extends LengthEqual<infer InferredLength>
					? InferredLength extends number
						? MaxCharacters<InferredLength>
						: never
					: never
			)
		>,
		unknown,
		GenericDefault
	>
	: never;

export type ComputeMaxCharactersCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	(
		ExtractMaxCharacters<GenericExpect, unknown> extends MaxCharacters<infer InferredTo>
			? InferredTo extends number
				? ExtractMaxCharacters<GenericValue, unknown> extends MaxCharacters<infer InferredFrom>
					? InferredFrom extends number
						? DNumber.IsGreaterOrEqual<InferredTo, InferredFrom> extends true
							? DCommon.CompatibilityConstraintResult<true, InferredFrom, InferredTo>
							: DCommon.CompatibilityConstraintResult<false, InferredFrom, InferredTo>
						: never
					: never
				: never
			: never
	),
	GenericDefault
>;

export type IsImpossibleToApplyMaxCharacters<
	GenericValue extends unknown,
	GenericExpect extends unknown,
> = DCommon.NeverCoalescing<
	(
		GenericValue extends string
			? ExtractMaxCharacters<GenericExpect, unknown> extends MaxCharacters<infer InferredTo>
				? InferredTo extends number
					? (
						| (
							ExtractLengthEqual<GenericValue, unknown> extends LengthEqual<infer InferredLength>
								? InferredLength extends number
									? DNumber.IsGreaterOrEqual<InferredTo, InferredLength> extends true
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
