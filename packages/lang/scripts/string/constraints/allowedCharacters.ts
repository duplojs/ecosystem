import type * as DCommon from "@scripts/common";
import type * as DObject from "@scripts/object";
import { type IsAllowedString, type IsLiteral } from "../types";

export interface CharactersRangeStore {

}

export type CharactersRange = Extract<
	DObject.GetPropsWithValueExtends<CharactersRangeStore, string>,
	string
>;

export type AllowedCharactersConstraintName = "string-allowed-characters";

export interface AllowedCharacters<
	GenericCharactersRange extends CharactersRange = never,
> extends DCommon.Constraint<
		AllowedCharactersConstraintName,
		() => Partial<Record<GenericCharactersRange, GenericCharactersRange>>
	> {
}

export type ExtractAllowedCharacters<
	GenericConstraint extends unknown,
	GenericDefault extends unknown = never,
> = GenericConstraint extends unknown
	? DCommon.Coalescing<
		DCommon.UnionToIntersection<
			| (
				GenericConstraint extends AllowedCharacters
					? (
						keyof ReturnType<GenericConstraint[DCommon.ConstraintSymbol][AllowedCharactersConstraintName]>
					) extends infer InferredResult extends CharactersRange
						? DCommon.IsNever<InferredResult> extends true
							? AllowedCharacters
							: AllowedCharacters<InferredResult>
						: GenericDefault
					: never
			)
		>,
		unknown,
		GenericDefault
	>
	: never;

export type ComputeAllowedCharactersCompatibility<
	GenericValue extends unknown,
	GenericExpect extends unknown,
	GenericDefault extends unknown = never,
> = DCommon.NeverCoalescing<
	| (
		ExtractAllowedCharacters<
			GenericValue,
			unknown
		> extends infer InferredAllowedCharactersValue extends AllowedCharacters
			? ExtractAllowedCharacters<
				GenericExpect,
				unknown
			> extends infer InferredAllowedCharactersExpect extends AllowedCharacters
				? InferredAllowedCharactersValue extends InferredAllowedCharactersExpect
					? DCommon.CompatibilityConstraintResult<
						true,
						keyof ReturnType<
							InferredAllowedCharactersValue[DCommon.ConstraintSymbol][AllowedCharactersConstraintName]
						>,
						keyof ReturnType<
							InferredAllowedCharactersExpect[DCommon.ConstraintSymbol][AllowedCharactersConstraintName]
						>
					>
					: DCommon.CompatibilityConstraintResult<
						false,
						keyof ReturnType<
							InferredAllowedCharactersValue[DCommon.ConstraintSymbol][AllowedCharactersConstraintName]
						>,
						keyof ReturnType<
							InferredAllowedCharactersExpect[DCommon.ConstraintSymbol][AllowedCharactersConstraintName]
						>
					>
				: never
			: never
	)
	| (
		GenericValue extends string
			? IsLiteral<GenericValue> extends true
				? ExtractAllowedCharacters<
					GenericExpect,
					unknown
				> extends AllowedCharacters<infer InferredCharactersRange>
					? IsAllowedString<GenericValue, CharactersRangeStore[InferredCharactersRange]> extends true
						? DCommon.CompatibilityConstraintResult<
							true,
							GenericValue,
							InferredCharactersRange
						>
						: DCommon.CompatibilityConstraintResult<
							false,
							GenericValue,
							InferredCharactersRange
						>
					: never
				: never
			: never
	),
	GenericDefault
>;
